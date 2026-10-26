#!/bin/bash
# Render Script

set -e

echo "Build script"

npm ci

npm ci --prefix server
npm ci --prefix client

npm run build

echo "Build completed successfully"