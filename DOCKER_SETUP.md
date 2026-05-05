# Docker Setup Checklist ✅

This checklist ensures your Bon Voyage project is properly configured for Docker deployment.

## Files Created

- ✅ `backend/Dockerfile` - Backend container definition
- ✅ `backend/.dockerignore` - Backend build context exclusions
- ✅ `frontend/Dockerfile` - Frontend container definition
- ✅ `frontend/.dockerignore` - Frontend build context exclusions
- ✅ `docker-compose.yml` - Multi-container orchestration
- ✅ `docker-start.sh` - Quick start script (Linux/macOS)
- ✅ `docker-start.bat` - Quick start script (Windows)
- ✅ `.env.example` - Environment variables template
- ✅ `DEPLOYMENT.md` - Comprehensive deployment guide
- ✅ `REFERENCES.md` - Project dependencies and citations
- ✅ `backend/app.py` (updated) - Enhanced path resolution for Docker
- ✅ `requirements.txt` (updated) - Added gunicorn and python-dotenv
- ✅ `readme.md` (updated) - Added Docker quick start & comprehensive docs

## Pre-Deployment Checks

### Repository Status
- [ ] All ML models committed (`ML/Model1/model/*.pkl`)
- [ ] All datasets committed (`ML/Model*/Datasets/*`)
- [ ] CNN model committed (`CNN/best_daynight_model.keras`)
- [ ] No large files excluded by `.gitignore` unnecessarily
- [ ] Run: `git ls-files | grep -E "(Model|CNN|Datasets)` to verify

### Local Testing
- [ ] Docker Desktop installed and running
- [ ] Test locally: `docker-compose up --build`
- [ ] Verify both services start successfully
- [ ] Check logs for any errors
- [ ] Test frontend at http://localhost:3000
- [ ] Test backend at http://localhost:5000

### Configuration
- [ ] `.env` file created from `.env.example`
- [ ] Review environment variables for your setup
- [ ] Verify `VITE_API_BASE_URL` is correct for your environment

### Docker Commands Reference
```bash
# Build
docker-compose build

# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Clean up
docker system prune
```

## Render.com Deployment

### Pre-Deployment
- [ ] GitHub repository created and all code pushed
- [ ] ML models and datasets included in repo
- [ ] Docker setup tested locally

### On Render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set environment: Docker
- [ ] Add environment variables:
  - `FLASK_ENV=production`
  - `VITE_API_BASE_URL=https://your-service-name.onrender.com`

### Post-Deployment
- [ ] Monitor Render logs during build
- [ ] Verify both backend and frontend services start
- [ ] Test deployed app at provided URL
- [ ] Check that frontend can reach backend API

## File Structure Verification

```
✓ backend/
  ✓ Dockerfile
  ✓ .dockerignore
  ✓ app.py
  ✓ requirements.txt

✓ frontend/
  ✓ Dockerfile
  ✓ .dockerignore
  ✓ package.json
  ✓ vite.config.ts

✓ ML/
  ✓ Model1/model/ (with .pkl files)
  ✓ Model2/Datasets/ (with .json files)
  ✓ Model3/

✓ CNN/
  ✓ best_daynight_model.keras

✓ Root directory:
  ✓ docker-compose.yml
  ✓ .env.example
  ✓ requirements.txt
  ✓ DEPLOYMENT.md
  ✓ REFERENCES.md
  ✓ docker-start.sh
  ✓ docker-start.bat
  ✓ readme.md (updated)
```

## Port Configuration

- **Frontend:** 3000 (customizable via `FRONTEND_PORT` env var)
- **Backend:** 5000 (customizable via `BACKEND_PORT` env var)
- **Render.com:** Automatically maps port 3000 to HTTPS public URL

## Troubleshooting

### Build Fails
```bash
# Clean rebuild
docker-compose build --no-cache

# Check specific service
docker-compose build backend --verbose
```

### Services Won't Start
```bash
# View detailed logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Verify models exist in container
docker-compose exec backend ls -la ../ML/Model1/model/
```

### Frontend Can't Reach Backend
```bash
# Check network
docker network ls
docker network inspect bon-voyage-network

# Test connectivity
docker-compose exec frontend wget http://backend:5000/
```

### Models Not Found
```bash
# Verify files are committed
git ls-files | grep -E "\.(pkl|keras|json)$"

# Add if missing
git add -f ML/ CNN/
git commit -m "Add ML models and datasets"
git push
```

## Quick Start Commands

### Local Development
```bash
# Windows
docker-start.bat

# macOS/Linux
bash docker-start.sh

# Or manual
docker-compose up --build
```

### Production Deployment
1. Push to GitHub with all models/datasets
2. Create Web Service on Render.com
3. Connect repository
4. Add environment variables
5. Deploy!

---

**Setup Status:** ✅ Complete and ready for deployment!

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
