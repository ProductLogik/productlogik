#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Productlogik Full Stack...${NC}"

# Function to detect OS
OS="$(uname)"
case $OS in
  'Linux')
    OS='Linux'
    ;;
  'Darwin') 
    OS='Mac'
    ;;
  'CYGWIN'*|'MINGW'*|'MSYS'*)
    OS='Windows'
    ;;
  *)
    OS='Unknown' 
    ;;
esac

echo -e "${GREEN}Detected OS: $OS${NC}"

# Helper to start backend
start_backend() {
    echo -e "${BLUE}Starting Backend (Port 8001)...${NC}"
    cd backend
    if [ "$OS" = "Windows" ]; then
        # On Windows Git Bash, 'uvicorn' might need python -m
        python -m uvicorn main:app --reload --host 127.0.0.1 --port 8001 &
    else
        uvicorn main:app --reload --host 127.0.0.1 --port 8001 &
    fi
    cd ..
}

# Start Backend
start_backend

# Wait for backend to initialize
sleep 3

# Start Frontend
echo -e "${BLUE}Starting Frontend (Port 5180)...${NC}"
cd frontend
npm run dev -- --force --port 5180
