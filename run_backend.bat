@echo off
title CareerPath AI - FastAPI Backend (Port 8000)
cd /d "%~dp0backend"
echo ========================================================
echo   Starting CareerPath AI Backend Server on Port 8000
echo   Docs: http://localhost:8000/docs
echo ========================================================
python run_backend.py
pause