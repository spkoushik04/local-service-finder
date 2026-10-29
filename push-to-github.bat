@echo off
title Push Local Service Finder to GitHub
color 0A
echo =====================================================================
echo           UPLOAD LOCAL SERVICE FINDER TO GITHUB
echo =====================================================================
echo.
echo GitHub Account: spkoushik04
echo Repository:     https://github.com/spkoushik04/local-service-finder
echo.
echo ---------------------------------------------------------------------
echo NOTE: GitHub requires authentication via:
echo   [1] Personal Access Token (PAT)
echo   [2] Browser Login via Git Credential Manager
echo ---------------------------------------------------------------------
echo.
set /p "CHOICE=Enter 1 (Use Token) or 2 (Use Browser Login) [1/2]: "

if "%CHOICE%"=="1" (
    echo.
    echo Generate your token in 30 seconds:
    echo 1. Open: https://github.com/settings/tokens
    echo 2. Click "Generate new token (classic)", check "repo", and generate.
    echo.
    set /p "GH_TOKEN=Paste your GitHub Personal Access Token (ghp_...): "
    if not defined GH_TOKEN (
        echo [ERROR] No token entered.
        pause
        exit /b 1
    )
    echo.
    echo [1/2] Creating repository on GitHub if it doesn't exist...
    curl -s -H "Authorization: token %GH_TOKEN%" -H "Accept: application/vnd.github.v3+json" https://api.github.com/user/repos -d "{\"name\":\"local-service-finder\",\"private\":false,\"description\":\"Local Service Finder - Full Stack Web Application\"}" > nul
    
    echo [2/2] Pushing code to GitHub main branch...
    git push "https://%GH_TOKEN%@github.com/spkoushik04/local-service-finder.git" main --force
    if %errorlevel% equ 0 (
        echo.
        echo =====================================================================
        echo [SUCCESS] Uploaded successfully!
        echo GitHub Link: https://github.com/spkoushik04/local-service-finder
        echo =====================================================================
    ) else (
        echo.
        echo [ERROR] Push failed. Please check if your token has 'repo' permissions.
    )
    pause
    exit /b
)

if "%CHOICE%"=="2" (
    echo.
    echo Please make sure you have created an empty repository named
    echo 'local-service-finder' at: https://github.com/new
    echo.
    pause
    echo.
    echo Pushing code... A browser window may open to sign in.
    git push -u origin main
    if %errorlevel% equ 0 (
        echo.
        echo =====================================================================
        echo [SUCCESS] Uploaded successfully!
        echo GitHub Link: https://github.com/spkoushik04/local-service-finder
        echo =====================================================================
    ) else (
        echo.
        echo [ERROR] Push failed.
    )
    pause
    exit /b
)

pause
