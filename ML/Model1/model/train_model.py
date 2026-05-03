import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.svm import SVC
from imblearn.over_sampling import SMOTE

df = pd.read_csv("../Datasets/Travel personality data - Form Responses.csv")

df = df.drop(columns=[
    "Timestamp",
    "Enter your name:",
    "Select your age group :",
    "Gender:"
])

df = df.rename(columns={
    "1. When traveling, I value excitement (thrill)": "Q1",
    "2. I like places that offer historical attractions / monuments ": "Q2",
    "3. I avoid typical tourist places whenever possible.": "Q3",
    "4. I like physically demanding travel experiences (trekking, rafting, long walks).": "Q4",
    "5. I usually make many new friends during my travels": "Q5",
    "6. I prefer places that teach me something and broaden my knowledge than simply help me get mind off work and everyday life.": "Q6",
    "7. When traveling, I prefer to spend time with other people than alone.": "Q7",
    "8. I like visiting busy markets, festivals, and cultural events.": "Q8",
    "9. I prefer calm, quiet destinations over crowded ones.": "Q9",
    "10. I prefer destinations that push me out of my comfort zone.": "Q10",
    "11. I prefer destinations known for culture and heritage over purely scenic locations.": "Q11",
    "12. I travel mainly to relax my mind rather than seek excitement.": "Q12",
    "How would you describe yourself as a traveler?": "Travel Personality"
})

X = df[[f"Q{i}" for i in range(1, 13)]]
y = df["Travel Personality"]

le = LabelEncoder()
y_encoded = le.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, stratify=y_encoded, random_state=42
)

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

smote = SMOTE(k_neighbors=2, random_state=42)
X_train_sm, y_train_sm = smote.fit_resample(X_train_scaled, y_train)


model = SVC(kernel='rbf', C=1, gamma='scale', probability=True)
model.fit(X_train_sm, y_train_sm)

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("encoder.pkl", "wb") as f:
    pickle.dump(le, f)

with open("scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

print("Model, encoder, and scaler saved successfully!")