#!/bin/bash
set -e

echo "Starting isolated deployment for ProductLogik..."

# 1. Update codebase
echo "Pulling latest code from main branch..."
git fetch origin main
git reset --hard origin/main

# 2. Frontend Build (Enforcing Heap Size Limits to protect VPS RAM)
echo "Installing and building frontend..."
cd frontend
npm install
NODE_OPTIONS="--max-old-space-size=400" npm run build
cd ..

# 3. Backend Setup
echo "Installing backend dependencies..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
cd ..

# 4. Restart Process Isolation
echo "Restarting targeted PM2 processes..."
# This ensures we don't accidentally restart HetaVideo
pm2 start ecosystem.config.js || pm2 restart productlogik-frontend productlogik-backend

# 5. Persist the isolated process state
pm2 save

echo "Deployment for ProductLogik completed securely!"
