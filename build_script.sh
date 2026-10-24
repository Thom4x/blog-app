#!/bin/bash
# Render Script

set -e

echo "Build script"

npm ci

npm run build

echo "Build completed successfully"