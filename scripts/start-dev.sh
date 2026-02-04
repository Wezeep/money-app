#!/usr/bin/env bash
# Cross-platform (UNIX) convenience script to start backend and mobile for local development.
# Usage: ./scripts/start-dev.sh
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$SCRIPT_DIR/.."

# Start backend in background
if [ -f ./backend/mvnw ]; then
  echo "Starting backend with ./backend/mvnw spring-boot:run"
  ./backend/mvnw spring-boot:run &
  BACKEND_PID=$!
else
  echo "Maven wrapper not found; try 'mvn spring-boot:run' in ./backend instead"
fi

# Start Expo in foreground
echo "Starting mobile (Expo)"
cd mobile
npx expo start

# On exit, kill backend if started by this script
if [ -n "${BACKEND_PID-}" ]; then
  echo "Stopping backend (pid $BACKEND_PID)"
  kill "$BACKEND_PID" || true
fi
