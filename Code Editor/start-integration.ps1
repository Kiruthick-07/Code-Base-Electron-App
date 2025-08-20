Write-Host "Starting DeepSeek-Coder Integration..." -ForegroundColor Green
Write-Host ""

Write-Host "[1/3] Installing backend dependencies..." -ForegroundColor Yellow
try {
    npm install express cors node-fetch
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to install dependencies"
    }
} catch {
    Write-Host "Error installing backend dependencies: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[2/3] Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js" -WindowStyle Normal

Write-Host ""
Write-Host "[3/3] Starting frontend development server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: Check the new terminal windows" -ForegroundColor Cyan
Write-Host ""
Write-Host "Make sure Ollama is running with: ollama serve" -ForegroundColor Yellow
Write-Host "And the model is pulled with: ollama pull deepseek-coder:1.3b" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
