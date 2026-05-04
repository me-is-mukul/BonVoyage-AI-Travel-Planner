import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path

DATASETS_DIR = Path(__file__).resolve().parents[1] / "Datasets"

with open(DATASETS_DIR / "zone_vectors.json", encoding="utf-8") as f:
    zone_vectors = json.load(f)

with open(DATASETS_DIR / "state_vectors.json", encoding="utf-8") as f:
    state_vectors = json.load(f)

with open(DATASETS_DIR / "city_vectors.json", encoding="utf-8") as f:
    city_vectors = json.load(f)

with open(DATASETS_DIR / "city_to_state.json", encoding="utf-8") as f:
    city_to_state = json.load(f)

with open(DATASETS_DIR / "state_to_zone.json", encoding="utf-8") as f:
    state_to_zone = json.load(f)

with open(DATASETS_DIR / "preference_model.json", encoding="utf-8") as f:
    preference_model = json.load(f)



CATEGORY_ORDER = ["Nature", "Historical", "Religious", "Adventure", "Urban"]

def get_user_vector(personality=None, vector=None):
    """
    Accept either:
    - personality string
    - direct vector
    """

    if vector is not None:
        return vector

    if personality is not None:
        if personality not in preference_model:
            raise ValueError(f"Unknown personality: {personality}")
        return preference_model[personality]

    raise ValueError("Either personality or vector must be provided")


def heuristic_score(user_vec, vec, rating=0):
    sim = cosine_similarity(user_vec, vec)[0][0]

    h = 1 - sim
    g = 1 - rating

    return h + g


def rank_nodes(user_vec, vectors, use_rating=False):
    results = []

    for name, vec_dict in vectors.items():
        vec = np.array([vec_dict[cat] for cat in CATEGORY_ORDER]).reshape(1, -1)

        rating = vec_dict.get("rating_norm", 0) if use_rating else 0

        f = heuristic_score(user_vec, vec, rating)

        results.append((name, f))

    results.sort(key=lambda x: x[1])
    return results


def recommend(personality=None, user_vector=None, top_k=5):
    """
    Main function to be called from Flask
    """

    user_vector = get_user_vector(personality, user_vector)

    user_vec = np.array(user_vector)
    user_vec = user_vec / np.sum(user_vec)
    user_vec = user_vec.reshape(1, -1)

    zone_rank = rank_nodes(user_vec, zone_vectors)
    top_zones = [z for z, _ in zone_rank[:2]]

    filtered_states = {
        s: v for s, v in state_vectors.items()
        if state_to_zone.get(s) in top_zones
    }

    state_rank = rank_nodes(user_vec, filtered_states)
    top_states = [s for s, _ in state_rank[:3]]

    filtered_cities = {
        c: v for c, v in city_vectors.items()
        if city_to_state.get(c) in top_states
    }

    city_rank = rank_nodes(user_vec, filtered_cities, use_rating=True)

    return [city for city, _ in city_rank[:top_k]]