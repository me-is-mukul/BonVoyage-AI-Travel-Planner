#!/bin/bash
# Docker Quick Start Script for Bon Voyage
# Usage: ./docker-start.sh

set -e

echo "🚀 Bon Voyage Docker Quick Start"
echo "=================================="

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop."
    exit 1
fi

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is ready"

# Check for .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "   Edit .env if needed for custom configuration"
fi

# Build and start services
echo ""
echo "🔨 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check health
if docker-compose ps | grep -q "healthy"; then
    echo ""
    echo "✅ Services are running!"
    echo ""
    echo "🌐 Access the application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:5000"
    echo ""
    echo "📊 View logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 To stop:"
    echo "   docker-compose down"
else
    echo ""
    echo "⚠️  Services may still be starting. Check logs:"
    echo "   docker-compose logs -f"
fi
