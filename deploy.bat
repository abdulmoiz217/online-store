@echo off
echo ========================================
echo   ShoeStore Website - Deploy to Vercel
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Vercel CLI not found. Installing...
    echo.
    call npm install -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install Vercel CLI
        pause
        exit /b 1
    )
    echo [OK] Vercel CLI installed successfully
    echo.
) else (
    echo [OK] Vercel CLI is installed
    echo.
)

REM Check if Git repository is initialized
if not exist ".git" (
    echo [INFO] Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - Ready for deployment"
    echo [OK] Git repository initialized
    echo.
) else (
    echo [OK] Git repository already initialized
    echo.
)

REM Login to Vercel
echo [INFO] Logging in to Vercel...
echo.
vercel login
echo.

REM Deploy to Vercel (Preview)
echo ========================================
echo   Starting Deployment (Preview)
echo ========================================
echo.
vercel

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo To deploy to production, run:
echo   vercel --prod
echo.
pause
