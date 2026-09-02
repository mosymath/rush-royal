@echo off
cd /d "%~dp0"
title Mosy Math - Game Server
cls
echo ================================================
echo    MOSY MATH
echo    Starting the game server...
echo ================================================
echo.
echo    Your browser will open at:
echo    http://localhost:3000
echo.
echo    IMPORTANT: Keep this window open while you play.
echo    To stop the server: press Ctrl+C.
echo ================================================
echo.

REM Install dependencies on first run
if not exist "node_modules" (
    echo [!] Installing dependencies (first run, may take a minute)...
    call pnpm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Dependency install failed. Make sure pnpm is installed.
        pause
        exit /b 1
    )
)

REM Build the game on first run
if not exist "dist\index.js" (
    echo [!] Building the game (first run, may take a minute)...
    call pnpm build
    if errorlevel 1 (
        echo.
        echo [ERROR] Build failed.
        pause
        exit /b 1
    )
)

REM Open the browser after a short delay so the server is ready
start /b cmd /c "ping -n 4 127.0.0.1 >nul & start http://localhost:3000"

echo Starting server...
echo.
call pnpm start

echo.
echo Server stopped.
pause
