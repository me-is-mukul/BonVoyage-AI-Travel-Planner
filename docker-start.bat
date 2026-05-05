@echo off
REM Docker Quick Start Script for Bon Voyage (Windows)
REM Usage: docker-start.bat

setlocal enabledelayedexpansion

echo.
echo 🚀 Bon Voyage Docker Quick Start
echo ==================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker daemon is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

echo ✅ Docker is ready

REM Check for .env file
if not exist .env (
    echo 📝 Creating .env from .env.example...
    copy .env.example .env
    echo    Edit .env if needed for custom configuration
)

REM Build and start services
echo.
echo 🔨 Building Docker images...
docker-compose build
if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo 🚀 Starting services...
docker-compose up -d
if errorlevel 1 (
    echo ❌ Failed to start services!
    pause
    exit /b 1
)

echo.
echo ⏳ Waiting for services to be healthy...
timeout /t 10 /nobreak

echo.
echo ✅ Services are running!
echo.
echo 🌐 Access the application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo.
echo 📊 View logs:
echo    docker-compose logs -f
echo.
echo 🛑 To stop:
echo    docker-compose down
echo.
pause
