from flask import Flask, request, jsonify
import os
import cv2
import numpy as np
import pickle

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ALLOWED = {"png", "jpg", "jpeg"}
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

_cnn_model_path = os.path.normpath(
    os.path.join(BASE_DIR, '..', 'CNN', 'best_daynight_model.keras')
)
if not os.path.exists(_cnn_model_path):
    raise FileNotFoundError(
        f"Model not found at {_cnn_model_path}\n"
        "Run the CNN/main.ipynb notebook end-to-end first to train and save the model."
    )
cnn_model = tf.keras.models.load_model(_cnn_model_path)
print(f"CNN model loaded from {_cnn_model_path}")

_personality_dir = os.path.normpath(os.path.join(BASE_DIR, '..', 'ML', 'Model1', 'model'))
with open(os.path.join(_personality_dir, "model.pkl"), "rb") as f:
    personality_model = pickle.load(f)
with open(os.path.join(_personality_dir, "encoder.pkl"), "rb") as f:
    encoder = pickle.load(f)
with open(os.path.join(_personality_dir, "scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)


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

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
