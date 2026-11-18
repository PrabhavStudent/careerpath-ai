$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptDir\backend"
Write-Host "Starting CareerPath AI FastAPI Backend (Port 8000)..." -ForegroundColor Cyan
python run_backend.py
