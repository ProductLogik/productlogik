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
    
    # Activate virtual environment if it exists
    if [ -d "venv" ]; then
        echo -e "${GREEN}Activating virtual environment...${NC}"
        source venv/Scripts/activate || source venv/bin/activate
    fi
    
    if [ "$OS" = "Windows" ]; then
        python -m uvicorn main:app --reload --host 127.0.0.1 --port 8001 &
    else
        uvicorn main:app --reload --host 127.0.0.1 --port 8001 &
    fi
    BACKEND_PID=$!
    cd ..
}

# Helper to start frontend
start_frontend() {
    echo -e "${BLUE}Starting Frontend (Port 5180)...${NC}"
    cd frontend
    npm run dev -- --force --port 5180
}

# Cleanup function
cleanup() {
    echo -e "\n${BLUE}Shutting down ProductLogik...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    exit
}

# Set up trap
trap cleanup SIGINT SIGTERM

# Start services
start_backend
sleep 2
start_frontend
