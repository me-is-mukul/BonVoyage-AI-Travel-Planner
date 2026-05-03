import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# load city vectors
with open("data/city_vectors.json") as f:
    city_vectors = json.load(f)


CATEGORY_ORDER = ["Nature", "Historical", "Religious", "Adventure", "Urban"]

def recommend_cities(user_vector, top_k=10):
    results = []

    user_vec = np.array(user_vector).reshape(1, -1)

    for city, vec_dict in city_vectors.items():
        city_vec = np.array([vec_dict[cat] for cat in CATEGORY_ORDER]).reshape(1, -1)

        sim = cosine_similarity(user_vec, city_vec)[0][0]
        rating = vec_dict["rating_norm"]
        # penalty for mismatch
        penalty = np.sum(np.abs(user_vec - city_vec)) / 5

        score = (
        0.6 * sim +
        0.3 * rating -
        0.3 * penalty
        )
        results.append((city, score))

    results.sort(key=lambda x: x[1], reverse=True)

    return results[:top_k]


if __name__ == "__main__":
    user_vector = [0.5, 0.32, 0.02, 0.14, 0.04]

    recommendations = recommend_cities(user_vector)

    print("\nTop Recommendations:\n")
    for city, score in recommendations:
        vec = np.array([city_vectors[city][cat] for cat in CATEGORY_ORDER])
        print(f"{city}: {round(score, 3)}")
        #print("   vector:", vec)
