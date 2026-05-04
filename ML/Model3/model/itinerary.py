import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
from sklearn.metrics.pairwise import cosine_similarity
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

pref_path = os.path.join(
    BASE_DIR,
    "..", "..", 
    "Model2",
    "Datasets",
    "preference_model.json"
)

with open(pref_path, "r") as f:
    preference_model = json.load(f)


CATEGORY_MAP = {
    "Nature": [1, 0, 0, 0, 0],
    "Historical": [0, 1, 0, 0, 0],
    "Religious": [0, 0, 1, 0, 0],
    "Adventure": [0, 0, 0, 1, 0],
    "Urban": [0, 0, 0, 0, 1]
}

def time_to_dt(t):
    return datetime.strptime(t, "%H:%M")


def normalize_time(val):
    val = str(val).lower()

    if "morning" in val:
        return "morning"
    if "afternoon" in val:
        return "afternoon"
    if "evening" in val:
        return "evening"
    if "night" in val:
        return "night"

    return "anytime"

def time_match_score(best_time, current_time):
    hour = current_time.hour

    if best_time == "anytime":
        return 1.0
    if best_time == "morning" and 6 <= hour < 11:
        return 1.0
    if best_time == "afternoon" and 11 <= hour < 16:
        return 1.0
    if best_time == "evening" and 16 <= hour < 19:
        return 1.0
    if best_time == "night" and hour >= 19:
        return 1.0

    return 0.3

def score_attraction(attraction, user_vector, time_left, current_time):

    pref = cosine_similarity(
        [user_vector],
        [attraction["feature_vector"]]
    )[0][0]

    rating = attraction["rating"] / 5.0

    eff = 1 - (attraction["hours_needed"] / max(time_left, 1))

    time_score = time_match_score(
        attraction["best_time"],
        current_time
    )

    return 0.4 * pref + 0.25 * rating + 0.2 * eff + 0.15 * time_score

def build_attractions(df, city):

    df_city = df[df["City"].str.lower() == city.lower()]

    attractions = []

    for _, row in df_city.iterrows():

        category = row["Category"]

        feature_vector = CATEGORY_MAP.get(category, [0,0,0,0,0])

        attraction = {
            "name": row["Name"],
            "type": row["Type"],
            "open": "08:00",
            "close": "20:00",
            "hours_needed": float(row["time needed to visit in hrs"]),
            "rating": float(row["Google review rating"]),
            "best_time": normalize_time(row["Best Time to visit"]),
            "feature_vector": feature_vector
        }

        attractions.append(attraction)

    return attractions

def generate_itinerary(city, days, personality, dataset_path):

    df = pd.read_csv(dataset_path)

    if personality not in preference_model:
        raise ValueError("Invalid personality")

    user_vector = preference_model[personality]

    attractions = build_attractions(df, city)

    START_TIME = "08:00"
    END_TIME   = "20:00"
    BUFFER_MIN = 60

    unvisited = attractions.copy()
    itinerary = {}

    for day in range(1, days + 1):

        clock = time_to_dt(START_TIME)
        end   = time_to_dt(END_TIME)

        day_plan = []

        while unvisited:

            time_left = (end - clock).seconds / 3600

            if time_left < 0.5:
                break

            available = [
                a for a in unvisited
                if time_to_dt(a["open"]) <= clock
                and time_to_dt(a["close"]) >= clock
                and a["hours_needed"] <= time_left
            ]

            if not available:
                break

            best = max(
                available,
                key=lambda a: score_attraction(
                    a, user_vector, time_left, clock
                )
            )

            day_plan.append({
                "time": clock.strftime("%I:%M %p"),
                "name": best["name"],
                "place": best["type"],
            })

            clock += timedelta(
                hours=best["hours_needed"],
                minutes=BUFFER_MIN
            )

            unvisited.remove(best)

        itinerary[f"Day {day}"] = day_plan

    return itinerary
