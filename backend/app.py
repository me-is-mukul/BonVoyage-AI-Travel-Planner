from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
from pathlib import Path
import cv2
import numpy as np
import pickle

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = Path(BASE_DIR).parent

ml_dir = ROOT_DIR / "ML"
if not ml_dir.exists():
    ml_dir = Path(BASE_DIR) / "ML"

if str(ml_dir) not in sys.path:
    sys.path.append(str(ml_dir))

from Model2.cityRecommender.recommender import recommend
from Model3.model.itinerary import generate_itinerary

ALLOWED = {"png", "jpg", "jpeg"}
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


_cnn_candidates = [
    os.path.join(BASE_DIR, '..', 'CNN', 'best_daynight_model.keras'),  
    os.path.join(BASE_DIR, 'CNN', 'best_daynight_model.keras'), 
]
_cnn_model_path = None
for candidate in _cnn_candidates:
    normalized = os.path.normpath(candidate)
    if os.path.exists(normalized):
        _cnn_model_path = normalized
        break

if not _cnn_model_path:
    raise FileNotFoundError(
        f"Model not found. Tried: {_cnn_candidates}\n"
        "Ensure CNN/best_daynight_model.keras exists."
    )

cnn_model = tf.keras.models.load_model(_cnn_model_path)
print(f"CNN model loaded from {_cnn_model_path}")


_personality_candidates = [
    os.path.join(BASE_DIR, '..', 'ML', 'Model1', 'model'),  
    os.path.join(BASE_DIR, 'ML', 'Model1', 'model'),  
]
_personality_dir = None
for candidate in _personality_candidates:
    normalized = os.path.normpath(candidate)
    if os.path.exists(normalized):
        _personality_dir = normalized
        break

if not _personality_dir:
    raise FileNotFoundError(
        f"Personality model not found. Tried: {_personality_candidates}\n"
        "Ensure ML/Model1/model/*.pkl files exist."
    )

with open(os.path.join(_personality_dir, "model.pkl"), "rb") as f:
    personality_model = pickle.load(f)
with open(os.path.join(_personality_dir, "encoder.pkl"), "rb") as f:
    encoder = pickle.load(f)
with open(os.path.join(_personality_dir, "scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)

print(f"Personality model loaded from {_personality_dir}")


def allowed_file(filename: str) -> bool:
    return filename.rsplit('.', 1)[-1].lower() in ALLOWED

def preprocess(file_bytes: bytes):
    arr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        return None
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (128, 128), interpolation=cv2.INTER_AREA)
    img = img.astype('float32') / 255.0
    return np.expand_dims(img, axis=0)


@app.route("/")
def home():
    return "API is running"

@app.route("/upload", methods=["POST"])
def upload():
    file = request.files["image"]
    if not allowed_file(file.filename):
        return {"error": "Invalid file type"}, 400
    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)
    return {"message": "uploaded"}

@app.route("/classify", methods=["POST"])
def classify():
    files = request.files.getlist("images")
    if not files:
        return jsonify({"error": "No files provided"}), 400

    results = []
    for file in files:
        if not allowed_file(file.filename):
            results.append({"filename": file.filename, "error": "Invalid file type"})
            continue

        img = preprocess(file.read())
        if img is None:
            results.append({"filename": file.filename, "error": "Could not read image"})
            continue

        prob = float(cnn_model.predict(img, verbose=0)[0, 0])
        results.append({
            "filename": file.filename,
            "label":    "Day" if prob >= 0.5 else "Night",
            "probability": round(prob, 4),
        })

    return jsonify(results)

@app.route("/predict_personality", methods=["POST"])
def predict_personality():
    try:
        data = request.get_json()
        answers = data.get("answers")

        if not answers or len(answers) != 12:
            return jsonify({"error": "Exactly 12 answers required"}), 400

        input_data = np.array(answers).reshape(1, -1)
        input_data = scaler.transform(input_data)

        prediction = personality_model.predict(input_data)
        personality = encoder.inverse_transform(prediction)[0]
        personality_str = str(personality)

        return jsonify({"personality": personality_str})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_cities", methods=["POST"])
def get_cities():
    try:
        data = request.get_json()
        personality = data.get("personality")

        if not personality:
            return jsonify({"error": "Personality is required"}), 400

        cities = recommend(personality=personality, top_k=5)
        return jsonify({"cities": cities})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/plan_trip", methods=["POST"])
def plan_trip():
    try:
        data = request.get_json()
        personality = data.get("personality")
        days = data.get("days")

        if not personality or not days:
            return jsonify({"error": "Missing personality or days"}), 400

        return jsonify({
            "message": f"Planning a {days}-day trip for {personality}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/get_itinerary", methods=["POST"])
def get_itinerary():
    try:
        data = request.get_json(silent=True) or {}

        city = data.get("city")
        days_raw = data.get("days")
        personality = data.get("personality")

        if not city or days_raw is None or not personality:
            return jsonify({"error": "city, days, and personality are required"}), 400

        try:
            days = int(days_raw)
        except (TypeError, ValueError):
            return jsonify({"error": "days must be a whole number"}), 400

        if days < 1 or days > 21:
            return jsonify({"error": "days must be between 1 and 21"}), 400

        dataset_path = os.path.normpath(
            os.path.join(ROOT_DIR, "ML", "Model3", "Datasets", "cleaned_travel.csv")
        )
        if not os.path.isfile(dataset_path):
            return jsonify({"error": f"Itinerary dataset missing at {dataset_path}"}), 503

        itinerary = generate_itinerary(
            city=city.strip(),
            days=days,
            personality=personality.strip(),
            dataset_path=dataset_path,
        )

        return jsonify({
            "city": city.strip(),
            "days": days,
            "personality": personality.strip(),
            "itinerary": itinerary,
        })

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)