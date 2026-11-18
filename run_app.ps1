# CareerPath AI - PowerShell Master Launcher
Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host "         Starting CareerPath AI Full-Stack Platform" -ForegroundColor Cyan
Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Backend in new window
Write-Host "[1/2] Launching FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\backend'; python run_backend.py"

# 2. Start Frontend in new window
Write-Host "[2/2] Launching Vite React Frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\frontend'; npm run dev"

Write-Host ""
Write-Host "Application initialized successfully!" -ForegroundColor Cyan
Write-Host "- Web Application: http://localhost:5173" -ForegroundColor Yellow
Write-Host "- OpenAPI Docs:    http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"
