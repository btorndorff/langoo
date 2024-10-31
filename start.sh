#!/bin/bash

# Function to stop all background processes when the script is terminated
cleanup() {
    echo "Stopping all processes..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up trap for cleanup on script termination
trap cleanup SIGINT SIGTERM

# Colors for console output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Start backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd backend
source venv/bin/activate 2>/dev/null || source .venv/bin/activate 2>/dev/null || echo "No virtual environment found"
python3 app.py &
python3 run_agent.py dev &

# Start frontend
echo -e "${GREEN}Starting Frontend Server...${NC}"
cd ../frontend
npm run dev &

# Keep the script running and show logs
echo -e "${BLUE}Both servers are starting...${NC}"
wait
