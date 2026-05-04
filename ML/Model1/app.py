from flask import Flask, request, jsonify
import numpy as np
import pickle
import os
import sys

# Add ML root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from Model2.cityRecommender.recommender import recommend

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "model", "model.pkl")
encoder_path = os.path.join(BASE_DIR, "model", "encoder.pkl")

with open(model_path, "rb") as f:
    model = pickle.load(f)

with open(encoder_path, "rb") as f:
    encoder = pickle.load(f)

with open(os.path.join(BASE_DIR, "model", "scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)

@app.route("/")
def home():
    return "API is running"

@app.route("/predict_personality", methods=["POST"])
def predict_personality():
    try:
        data = request.get_json()
        answers = data.get("answers")

        if not answers or len(answers) != 12:
            return jsonify({"error": "Exactly 12 answers required"}), 400

        input_data = np.array(answers).reshape(1, -1)
        input_data = scaler.transform(input_data)

        prediction = model.predict(input_data)
        personality = encoder.inverse_transform(prediction)[0]

        return jsonify({
            "personality": personality
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_cities", methods=["POST"])
def get_cities():
    try:
        data = request.get_json()
        personality = data.get("personality")

        if not personality:
            return jsonify({"error": "Personality is required"}), 400

        cities = recommend(personality=personality)

        return jsonify({
            "cities": cities
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)