#!/bin/bash

# =====================================================
# PHANTOM BANK - BUILD SCRIPT FOR FIVEM
# =====================================================
# This script builds the NUI and prepares it for FiveM
# =====================================================

set -e  # Exit on error

echo "🏦 Phantom Bank - FiveM Build Script"
echo "======================================"
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm is not installed"
    echo "Install it with: npm install -g pnpm"
    exit 1
fi

echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🔨 Building for production..."
pnpm build

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📁 Files are ready in: ./dist"
echo ""
echo "📋 Next steps:"
echo "1. Copy ./dist/* to your FiveM resource html/ folder"
echo "2. Follow SETUP_GUIDE.md for server integration"
echo "3. Configure config.lua with your settings"
echo ""
echo "🎉 Done! Happy coding!"
