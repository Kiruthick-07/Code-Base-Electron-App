@echo off
echo Starting DeepSeek-Coder Integration...
echo.

echo [1/3] Installing backend dependencies...
call npm install express cors node-fetch
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b 1
)

echo.
echo [2/3] Starting backend server...
start "DeepSeek-Coder Backend" cmd /k "node server.js"

echo.
echo [3/3] Starting frontend development server...
start "DeepSeek-Coder Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: Check the new terminal window
echo.
echo Make sure Ollama is running with: ollama serve
echo And the model is pulled with: ollama pull deepseek-coder:1.3b
echo.
pause
