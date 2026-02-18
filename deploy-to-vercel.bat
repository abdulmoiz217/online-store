@echo off
echo ========================================
echo   ShoeStore - Deploy to Vercel
echo ========================================
echo.

REM Check if Git is initialized
if not exist ".git" (
    echo [INFO] Initializing Git...
    git init
    git add .
    git commit -m "Initial commit - Clean static site"
    echo.
)

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Installing Vercel CLI...
    call npm install -g vercel
    echo.
)

REM Login to Vercel
echo [INFO] Logging in to Vercel...
call vercel login
echo.

REM Deploy to production
echo ========================================
echo   Deploying to Vercel...
echo ========================================
echo.
call vercel --prod

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Your website is now live on Vercel!
echo.
pause
