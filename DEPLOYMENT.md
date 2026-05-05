# Deployment Guide

This guide covers deploying **Bon Voyage** to Render.com using Docker.

## Prerequisites

### For Local Docker Development
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- All ML models and datasets committed to the repository

### For Render.com Deployment
- GitHub account with repository pushed
- Render.com account (free tier available)
- All ML models, datasets, and pickle files in repository

---

## Local Docker Deployment

### 1. Build and Run Locally

```bash
# Navigate to project root
cd Bon\ Voyage

# Create .env file (optional - uses defaults otherwise)
cp .env.example .env

# Build and start all services
docker-compose up --build
```

**Services will be available at:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### 2. Environment Variables

Create `.env` in project root:

```env
# Flask backend
FLASK_ENV=production
BACKEND_PORT=5000

# Frontend
FRONTEND_PORT=3000

# API endpoint (for frontend to reach backend)
VITE_API_BASE_URL=http://backend:5000

# Optional: Google Maps API Key
# VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. Stop Services

```bash
# Stop and remove containers
docker-compose down

# Also remove volumes
docker-compose down -v
```

### 5. Rebuild After Code Changes

```bash
# Force rebuild
docker-compose up --build --force-recreate

# Or just rebuild specific service
docker-compose build backend --no-cache
docker-compose up backend
```

---

## Render.com Deployment

### Step 1: Prepare Your Repository

Ensure all required files are committed:

```bash
# Verify datasets are tracked
git status

# If datasets are ignored, update .gitignore
# Remove or comment out: Datasets/

# Add all including models and datasets
git add .
git commit -m "Add Docker setup and ML models for Render deployment"
git push
```

### Step 2: Create Render Service

1. **Go to [Render.com](https://render.com)**
2. **Dashboard → New → Web Service**
3. **Connect GitHub repository** with your Bon Voyage project
4. **Configure Service:**

| Setting | Value |
|---------|-------|
| **Name** | bon-voyage (or your choice) |
| **Environment** | Docker |
| **Region** | Choose closest to users |
| **Branch** | main (or your main branch) |
| **Build Command** | Leave empty (uses docker-compose) |
| **Start Command** | Leave empty |
| **Plan** | Free (or Pro for more resources) |

### Step 3: Environment Variables

Add these in Render dashboard (Settings → Environment):

```
FLASK_ENV=production
VITE_API_BASE_URL=https://your-service-name.onrender.com
```

Or in `.env` file committed to repo (NOT recommended for secrets):

```env
FLASK_ENV=production
VITE_API_BASE_URL=https://your-service-name.onrender.com
```

### Step 4: Deploy

1. **Click "Create Web Service"**
2. Render will:
   - Pull your repository
   - Build Docker images
   - Start backend service first
   - Start frontend service
   - Expose frontend on public URL

3. **Monitor deployment:**
   - Go to "Logs" tab in Render dashboard
   - Check both services are healthy

### Step 5: Access Your App

```
https://your-service-name.onrender.com
```

---

## Important Notes

### File Structure Required for Docker

```
Bon Voyage/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── app.py
│   ├── requirements.txt
│   └── uploads/
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
├── ML/
│   ├── Model1/
│   │   └── model/ (with .pkl files)
│   ├── Model2/
│   │   ├── Datasets/ ⭐ MUST BE IN REPO
│   │   └── cityRecommender/
│   └── Model3/
│       └── model/
├── CNN/
│   └── best_daynight_model.keras ⭐ MUST BE IN REPO
├── docker-compose.yml
└── .env.example
```

### Model Loading

- **CNN Model:** Loaded from `CNN/best_daynight_model.keras`
- **Personality Model:** Loaded from `ML/Model1/model/`
- **City Recommender:** Uses `ML/Model2/Datasets/*.json`
- **Itinerary Generator:** Uses `ML/Model3/model/itinerary.py`

All paths are resolved relative to the `/app` directory in Docker.

### Port Mapping

- **Backend:** Container port 5000 → External port (configurable)
- **Frontend:** Container port 3000 → External port (configurable)
- **Render.com:** Automatically assigns HTTPS URLs

---

## Troubleshooting

### Backend service fails to start

```bash
# Check logs
docker-compose logs backend

# Verify models exist
docker-compose exec backend ls -la ../ML/Model1/model/
docker-compose exec backend ls -la ../CNN/
```

### Frontend can't reach backend

```bash
# Verify VITE_API_BASE_URL environment variable
docker-compose exec frontend env | grep VITE_API_BASE_URL

# Test backend connectivity from frontend container
docker-compose exec frontend wget http://backend:5000/
```

### Models not found in Render

1. Verify files are committed: `git ls-files | grep ML`
2. Check if `.gitignore` excludes them: `cat .gitignore | grep Datasets`
3. Push changes: `git push`
4. Redeploy in Render

### Render free tier limits

- 15-minute inactivity auto-sleep (restart on request)
- 512 MB RAM
- Limited build time

For production, upgrade to **Pro plan**.

---

## Useful Docker Commands

```bash
# Remove unused images and containers
docker system prune

# Check running containers
docker ps

# Enter container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# View container resource usage
docker stats

# Rebuild specific service
docker-compose up -d --build backend
```

---

## Production Checklist

- [ ] All ML models and datasets committed to repository
- [ ] `.env` file configured with production settings
- [ ] Render service created and deployed
- [ ] Monitor logs for errors
- [ ] Test all API endpoints
- [ ] Verify image upload functionality
- [ ] Check model inference performance
- [ ] Configure backups for upload folder (if persistent storage needed)

---

## Support

For issues or questions:
1. Check Render logs: Dashboard → Logs
2. Review Docker build output
3. Verify all paths and environment variables
4. Test locally with `docker-compose up` first
