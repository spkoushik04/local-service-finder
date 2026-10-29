@echo off
title Local Service Finder - Frontend
color 0B
echo =====================================================================
echo  LOCAL SERVICE FINDER - HTML5 / CSS3 / VANILLA JAVASCRIPT FRONTEND
echo =====================================================================
echo.
cd /d "%~dp0frontend"

where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Python detected. Starting HTTP server on port 3000...
    echo.
    echo   PC Browser:                  http://localhost:3000/login.html
    echo   Mobile Browser (Same Wi-Fi): http://192.168.1.8:3000/login.html
    echo.
    start "" "http://localhost:3000/login.html"
    python -m http.server 3000
) else (
    echo Opening frontend/login.html in default browser...
    start "" "login.html"
    pause
)
