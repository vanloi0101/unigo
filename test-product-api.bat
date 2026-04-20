@echo off
REM test-product-api.bat - Product API Testing (Windows)
REM Make sure curl is available in your system

setlocal enabledelayedexpansion

set "API_BASE=http://localhost:5000/api"
set "ADMIN_TOKEN=%1"

echo.
echo ========== UNIGO PRODUCT API TEST ==========
echo.

REM Test 1: Get all products
echo [TEST 1] Fetch all products
echo GET %API_BASE%/products
curl -s -X GET "%API_BASE%/products?page=1&limit=100" | find "products"
echo.

REM Test 2: Login (if no token provided)
if "%ADMIN_TOKEN%"=="" (
  echo [TEST 2] Admin Login
  echo POST %API_BASE%/auth/login
  curl -s -X POST "%API_BASE%/auth/login" ^
    -H "Content-Type: application/json" ^
    -d "{\"email\": \"admin@example.com\", \"password\": \"admin123\"}"
  echo.
  echo ! Please extract the token from the login response above
  exit /b 1
) else (
  echo ^ Using provided admin token
  echo.
)

REM Test 3: Create a test product
echo [TEST 3] Create Test Product
echo POST %API_BASE%/products

for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set "PRODUCT_NAME=TEST_%mydate%_%mytime%"

curl -s -X POST "%API_BASE%/products" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"%PRODUCT_NAME%\", \"price\": 75000, \"stock\": 5}"
echo.

REM Test 4: Verify product in list
echo [TEST 4] Verify Product in List
curl -s -X GET "%API_BASE%/products?page=1&limit=100"
echo.

echo ========== TEST COMPLETE ==========
echo.
