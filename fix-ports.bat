@echo off
REM Quick port conflict fixer for Unigo
REM This script kills processes using ports 3000, 5000, 5173, 8080

echo.
echo ===================================
echo     UNIGO PORT CONFLICT FIXER
echo ===================================
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Please run this script as Administrator!
    pause
    exit /b 1
)

echo [*] Checking for processes using ports 3000, 5173, 5174, 8080...
echo.

REM Check each port
for %%P in (3000 5173 5174 8080) do (
    echo Checking port %%P...
    netstat -ano | findstr ":%%P" > nul
    if !errorlevel! equ 0 (
        echo   [FOUND] Process using port %%P
        netstat -ano | findstr ":%%P"
    ) else (
        echo   [FREE] Port %%P is available
    )
)

echo.
echo [*] Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM npm.exe 2>nul

echo [+] Done! Ports should now be available.
echo.
pause
