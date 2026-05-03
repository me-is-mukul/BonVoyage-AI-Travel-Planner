from flask import Flask, request, jsonify
import os
import cv2
import numpy as np

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf

app = Flask(__name__)

ALLOWED = {"png", "jpg", "jpeg"}
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

_model_path = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'CNN', 'best_daynight_model.keras')
)
if not os.path.exists(_model_path):
    raise FileNotFoundError(
        f"Model not found at {_model_path}\n"
        "Run the CNN/main.ipynb notebook end-to-end first to train and save the model."
    )
model = tf.keras.models.load_model(_model_path)
print(f"Model loaded from {_model_path}")

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
    return np.expand_dims(img, axis=0)   # (1, 128, 128, 3)

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

        prob = float(model.predict(img, verbose=0)[0, 0])
        results.append({
            "filename": file.filename,
            "label":    "Day" if prob >= 0.5 else "Night",
            "probability": round(prob, 4),
        })

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
