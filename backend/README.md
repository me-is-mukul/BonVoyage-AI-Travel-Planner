# Bon Voyage Backend API

Run with: `python app.py` — starts on `http://localhost:5000`

---

## Routes

### `GET /`
Health check.

**Response**
```
API is running
```

---

### `POST /upload`
Save a single image to the server.

**Body** — `form-data`
| Key | Type | Description |
|-----|------|-------------|
| `image` | File | PNG, JPG, or JPEG only |

**Response**
```json
{ "message": "uploaded" }
```

---

### `POST /classify`
Classify one or more images as **Day** or **Night** using the CNN model.

**Body** — `form-data`
| Key | Type | Description |
|-----|------|-------------|
| `images` | File (repeatable) | PNG, JPG, or JPEG — send multiple with the same key |

**Response**
```json
[
  { "filename": "photo.jpg", "label": "Day", "probability": 0.9312 },
  { "filename": "night.png", "label": "Night", "probability": 0.1045 }
]
```
`probability` is the raw Day score (≥ 0.5 → Day, < 0.5 → Night).

---

### `POST /predict_personality`
Predict travel personality from a 12-question survey.

**Body** — `application/json`
```json
{ "answers": [3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4] }
```
`answers` must be an array of exactly **12** numeric values.

**Response**
```json
{ "personality": "Adventurer" }
```

---

### `POST /get_cities`
Return top 5 recommended cities for a predicted personality.

**Body** — `application/json`
```json
{ "personality": "Adventurer" }
```

**Response**
```json
{ "cities": ["Manali", "Rishikesh", "Leh", "Coorg", "Kasol"] }
```

---

### `POST /plan_trip`
Generate a trip plan message for a given personality and trip length.
Intended to be called after `/predict_personality`.

**Body** — `application/json`
```json
{ "personality": "Adventurer", "days": 5 }
```

**Response**
```json
{ "message": "Planning a 5-day trip for Adventurer" }
```

---

### `POST /get_itinerary`
Generate a day-by-day itinerary for a chosen city using **Model3** (`ML/Model3/model/itinerary.py`) and attraction rows in **`ML/Model3/Datasets/cleaned_travel.csv`**.

**Body** — `application/json`
```json
{
  "city": "Manali",
  "days": 5,
  "personality": "Social Butterfly (The Cultural Explorer)"
}
```

Rules:

- **`personality`** must match one of the keys in `ML/Model2/Datasets/preference_model.json`.
- **`days`** must be a whole number from **1** to **21**.

**Success response**

```json
{
  "city": "Manali",
  "days": 5,
  "personality": "Social Butterfly (The Cultural Explorer)",
  "itinerary": {
    "Day 1": [
      { "time": "08:00 AM", "name": "...", "place": "..." }
    ],
    "Day 2": []
  }
}
```

**Errors**

| Condition | Stat |
|-----------|-----|
| Missing field | **400** |
| Invalid personality or unknown city | **400** |
| Dataset file missing | **503** |
| Other server error | **500** |

---

## Frontend Flow

1. User answers 12 survey questions in the frontend.
2. Frontend calls `POST /predict_personality`.
3. Frontend calls `POST /get_cities` using returned personality.
4. Frontend shows top 5 cities and user selects one.
5. User is routed to **`/itinerary`**. The frontend calls **`POST /get_itinerary`** with `city`, `days`, and `personality`, then renders the returned schedule day by day.
