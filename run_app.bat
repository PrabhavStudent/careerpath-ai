@echo off
title CareerPath AI - Master Launcher
echo =======================================================================
echo          Starting CareerPath AI Full-Stack Platform
echo =======================================================================
echo.
echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "CareerPath AI Backend" cmd /k "cd /d "%~dp0backend" && python run_backend.py"

echo [2/2] Launching Vite React Frontend on http://localhost:5173 ...
start "CareerPath AI Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Application initialized!
echo - Web Application: http://localhost:5173
echo - OpenAPI Docs:    http://localhost:8000/docs
echo.
timeout /t 3 /nobreak >nul
start http://localhost:5173
exit