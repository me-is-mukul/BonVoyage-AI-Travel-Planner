import pandas as pd
import json

df = pd.read_csv("Datasets/Travel personality data - Form Responses.csv")

df = df.rename(columns={
    "Nature-Based Destinations :" : "Nature",
    "Historical & Cultural Places :" : "Historical",
    "Religious / Spiritual Destinations :" : "Religious",
    "Beach & Adventure Destinations :" : "Adventure",
    "Urban / City-Centric Destinations :" : "Urban",
    "How would you describe yourself as a traveler?": "Personality"
})

cols = ["Nature", "Historical", "Religious", "Adventure", "Urban", "Personality"]
df = df[cols]

grouped = df.groupby("Personality").mean()

preference_matrix = grouped.div(grouped.sum(axis=1), axis=0)

preference_dict = {}

for personality, row in preference_matrix.iterrows():
    preference_dict[personality] = [
        row["Nature"],
        row["Historical"],
        row["Religious"],
        row["Adventure"],
        row["Urban"]
    ]

with open("../Datasets/preference_model.json", "w") as f:
    json.dump(preference_dict, f, indent=4)

print("Preference model saved!")