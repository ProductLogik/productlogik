#!/bin/bash

# Define colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${RED}Stopping Productlogik Services...${NC}"

OS="$(uname)"
case $OS in
  'Linux'|'Darwin')
    # Unix-like systems use lsof/kill
    echo "Stopping processes on ports 8001 and 5180..."
    lsof -ti:8001 | xargs kill -9 2>/dev/null
    lsof -ti:5180 | xargs kill -9 2>/dev/null
    ;;
  'CYGWIN'*|'MINGW'*|'MSYS'*)
    # Windows uses taskkill
    echo "Stopping processes on Windows..."
    # Find PID for port 8001 (Backend)
    pid_back=$(netstat -ano | findstr :8001 | awk '{print $5}' | uniq)
    if [ ! -z "$pid_back" ]; then
        taskkill //PID $pid_back //F
        echo -e "${GREEN}Backend stopped.${NC}"
    fi

    # Find PID for port 5180 (Frontend)
    pid_front=$(netstat -ano | findstr :5180 | awk '{print $5}' | uniq)
    if [ ! -z "$pid_front" ]; then
        taskkill //PID $pid_front //F
        echo -e "${GREEN}Frontend stopped.${NC}"
    fi
    ;;
  *)
    echo "Unknown OS. Please stop processes manually."
    ;;
esac

echo -e "${GREEN}All services stopped.${NC}"
