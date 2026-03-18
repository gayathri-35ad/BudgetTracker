#!/usr/bin/env bash
# Exit on error
set -o errexit

# Build frontend
echo "Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# Install backend dependencies
echo "Building Backend..."
pip install -r backend/requirements.txt

# Run Django commands
echo "Collecting Static Files & Migrating..."
python backend/manage.py collectstatic --no-input
python backend/manage.py migrate
