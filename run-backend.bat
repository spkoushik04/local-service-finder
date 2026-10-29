@echo off
title Local Service Finder - Spring Boot Backend
color 0A
echo =====================================================================
echo  LOCAL SERVICE FINDER - SPRING BOOT BACKEND
echo  Architecture: Spring Boot 3 + Spring MVC + Spring Data JPA + MySQL
echo =====================================================================
echo.

set "PORTABLE_MVN=%~dp0maven\apache-maven-3.9.16\bin\mvn.cmd"
if exist "%PORTABLE_MVN%" (
    set "MVN_CMD=%PORTABLE_MVN%"
    echo [OK] Using bundled portable Apache Maven 3.9.16.
) else (
    where mvn >nul 2>nul
    if %errorlevel% equ 0 (
        set "MVN_CMD=mvn"
        echo [OK] Using system Maven from PATH.
    ) else (
        echo [ERROR] Maven not found.
        pause
        exit /b 1
    )
)

cd /d "%~dp0backend"
echo.
echo =====================================================================
echo  Starting Spring Boot on http://localhost:8080 ...
echo  Press Ctrl+C to stop the server.
echo =====================================================================
echo.

call "%MVN_CMD%" spring-boot:run
pause
