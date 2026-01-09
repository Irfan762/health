#!/bin/bash

# Build script for Render deployment

echo "🚀 Starting MediEquip build process..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Build frontend
echo "🏗️ Building frontend..."
npm run build

echo "✅ Build completed successfully!"

# List build output
echo "📁 Build output:"
ls -la dist/