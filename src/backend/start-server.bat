@echo off
REM Kill all Node processes
taskkill /F /IM node.exe >nul 2>&1
echo Waiting 3 seconds...
timeout /t 3 /nobreak

REM Navigate to backend
cd /d C:\Users\vanlo\all\webapp\unigo\src\backend

REM Start the server
echo Starting backend on port 9000...
npm run dev
