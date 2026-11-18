$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptDir\frontend"
Write-Host "Starting CareerPath AI React + Vite Frontend (Port 5173)..." -ForegroundColor Cyan
npm run dev
