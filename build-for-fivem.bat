@echo off
REM =====================================================
REM PHANTOM BANK - BUILD SCRIPT FOR FIVEM (WINDOWS)
REM =====================================================
REM This script builds the NUI and prepares it for FiveM
REM =====================================================

echo.
echo 🏦 Phantom Bank - FiveM Build Script
echo ======================================
echo.

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: pnpm is not installed
    echo Install it with: npm install -g pnpm
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Installation failed!
    pause
    exit /b 1
)

echo.
echo 🔨 Building for production...
call pnpm build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo ✅ Build completed successfully!
echo.
echo 📁 Files are ready in: .\dist
echo.
echo 📋 Next steps:
echo 1. Copy .\dist\* to your FiveM resource html\ folder
echo 2. Follow SETUP_GUIDE.md for server integration
echo 3. Configure config.lua with your settings
echo.
echo 🎉 Done! Happy coding!
echo.
pause
