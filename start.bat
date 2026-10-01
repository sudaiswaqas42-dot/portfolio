@echo off
title Portfolio Project - Frontend ^& Backend Server
cd /d "%~dp0"

echo ========================================================
echo       Starting Portfolio (Frontend + Backend)
echo ========================================================
echo.
echo   Frontend URL: http://localhost:3000
echo   Backend URL:  http://localhost:5000
echo   Admin Portal: http://localhost:3000/admin
echo.
echo   Browser will open automatically in 2 seconds...
echo   Press Ctrl + C to stop the servers.
echo ========================================================
echo.

REM Automatically open browser in background after 2 seconds
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"

REM Start both backend and frontend concurrently
call npm run dev

echo.
echo Server stopped.
pause
