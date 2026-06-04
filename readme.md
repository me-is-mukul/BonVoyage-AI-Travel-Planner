![Python](https://img.shields.io/badge/Python-3.x-blue?logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.5-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.21.0-FF6F00?logo=tensorflow&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.2.4-06B6D4?logo=tailwindcss&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.1.3-000000?logo=flask&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Supported-2496ED?logo=docker&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

---

# Bon Voyage - AI-Powered Travel Recommendation Platform

Personalized travel itinerary generation using machine learning, featuring travel personality classification, city recommendations, and day-by-day activity suggestions.

**SRS documentation:** See [SRS folder](./SRS/) for detailed requirements.

---

## 🚀 Quick Start

### Option 1: Docker (Recommended - One Command!)

#### Windows
```bash
docker-start.bat
```

#### macOS/Linux
```bash
bash docker-start.sh
```

#### Or manually:
```bash
cd Bon\ Voyage
docker-compose up --build
```

**Deployed at:**
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend API: http://localhost:5000

---

### Option 2: Local Development (Manual Setup)

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup
```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cd backend
python app.py
```

---

## 🐳 Docker Configuration

### Environment Variables

Create `.env` from template:
```bash
cp .env.example .env
```

Customize as needed:
```env
FLASK_ENV=production
BACKEND_PORT=5000
FRONTEND_PORT=3000
VITE_API_BASE_URL=http://backend:5000
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services
```bash
docker-compose down
```

### Rebuild After Changes
```bash
docker-compose up --build --force-recreate
```

---

## 📦 Deployment to Render.com

For comprehensive deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

**Quick summary:**
1. Push repository with ML models/datasets
2. Create Web Service on Render.com
3. Connect GitHub repository
4. Set environment variables
5. Deploy!

---

## 📋 Project Structure

```
Bon Voyage/
├── backend/                    # Flask API server
│   ├── app.py                 # Main application
│   ├── Dockerfile             # Backend Docker image
│   └── uploads/               # User-uploaded images
├── frontend/                   # React/TypeScript UI
│   ├── src/
│   │   ├── routes/           # Page components
│   │   ├── components/       # Reusable UI components
│   │   └── features/         # Feature logic & API calls
│   ├── Dockerfile            # Frontend Docker image
│   └── vite.config.ts
├── ML/                         # Machine Learning models
│   ├── Model1/               # Travel personality classifier (SVM)
│   ├── Model2/               # City recommender (TF-IDF + Cosine)
│   └── Model3/               # Itinerary generator
├── CNN/                        # Day/Night image classifier
│   └── best_daynight_model.keras
├── SRS/                        # System requirements
├── docker-compose.yml         # Multi-container orchestration
├── requirements.txt           # Python dependencies
└── DEPLOYMENT.md             # Deployment guide
```

---

## 🤖 Machine Learning Models

### Model 1: Travel Personality Classifier
- **Algorithm:** Support Vector Machine (SVM)
- **Features:** 12-question Likert scale survey
- **Output:** Travel personality profile
- **Files:** `ML/Model1/model/model.pkl`, `encoder.pkl`, `scaler.pkl`

### Model 2: City Recommender  
- **Algorithm:** Cosine Similarity (TF-IDF vectors)
- **Features:** User personality vector, city characteristics
- **Output:** Top recommended cities
- **Files:** `ML/Model2/Datasets/*.json` (embeddings)

### Model 3: Itinerary Generator
- **Algorithm:** Category-based scoring with time matching
- **Features:** City amenities, activity categories, time preferences
- **Output:** Day-by-day activity itinerary
- **Dependencies:** Model 2 vectors, travel dataset

### CNN: Day/Night Image Classifier
- **Architecture:** Keras CNN
- **Input:** User-uploaded travel photos
- **Output:** Day/Night classification with confidence score
- **File:** `CNN/best_daynight_model.keras`

---

## 🔌 API Endpoints

### Backend API (Port 5000)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check |
| `/predict_personality` | POST | Classify travel personality |
| `/get_cities` | POST | Get recommended cities |
| `/get_itinerary` | POST | Generate day-by-day itinerary |
| `/upload` | POST | Upload travel photos |
| `/classify` | POST | Classify photos (Day/Night) |

### Frontend Routes (Port 3000)

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/plan-trip` | Personality quiz & city selection |
| `/itinerary` | View/explore generated itineraries |
| `/manage-pics` | Upload & classify photos |

---

## 📝 Technologies Used

### Backend
- **Framework:** Flask
- **ML/DL:** TensorFlow, Keras, Scikit-learn
- **Data:** Pandas, NumPy
- **Vision:** OpenCV
- **Production:** Gunicorn

### Frontend
- **Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Build:** Vite
- **3D Visualization:** Three.js, react-globe.gl
- **Routing:** React Router v7

### DevOps
- **Containerization:** Docker & Docker Compose
- **Deployment:** Render.com
- **VCS:** Git

---

## 📖 References

See [References](./REFERENCES.md) for detailed citations of libraries and frameworks used.

---
