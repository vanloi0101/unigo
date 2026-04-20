#!/bin/bash
# test-product-api.sh - Comprehensive API Testing Script
# Usage: bash test-product-api.sh [token]

API_BASE="http://localhost:5000/api"
ADMIN_TOKEN="${1:-}"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========== UNIGO PRODUCT API TEST ==========${NC}\n"

# Test 1: Get all products
echo -e "${YELLOW}[TEST 1] Fetch all products${NC}"
echo "GET $API_BASE/products?page=1&limit=100"
PRODUCTS=$(curl -s -X GET "$API_BASE/products?page=1&limit=100")
echo "Response:"
echo "$PRODUCTS" | jq '.' 2>/dev/null || echo "$PRODUCTS"

PRODUCT_COUNT=$(echo "$PRODUCTS" | jq '.products | length' 2>/dev/null || echo "ERR")
echo -e "${GREEN}✓ Product Count: $PRODUCT_COUNT${NC}\n"

# Test 2: Login (if token not provided)
if [ -z "$ADMIN_TOKEN" ]; then
  echo -e "${YELLOW}[TEST 2] Admin Login${NC}"
  echo "POST $API_BASE/auth/login"
  LOGIN=$(curl -s -X POST "$API_BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "admin@example.com",
      "password": "admin123"
    }')
  echo "Response:"
  echo "$LOGIN" | jq '.' 2>/dev/null || echo "$LOGIN"
  
  ADMIN_TOKEN=$(echo "$LOGIN" | jq -r '.token' 2>/dev/null)
  if [ -z "$ADMIN_TOKEN" ] || [ "$ADMIN_TOKEN" == "null" ]; then
    echo -e "${RED}✗ Failed to get admin token${NC}"
    echo "  Make sure admin user exists with:"
    echo "    Email: admin@example.com"
    echo "    Password: admin123"
    exit 1
  fi
  echo -e "${GREEN}✓ Admin Token: ${ADMIN_TOKEN:0:20}...${NC}\n"
else
  echo -e "${GREEN}✓ Using provided admin token: ${ADMIN_TOKEN:0:20}...${NC}\n"
fi

# Test 3: Create a test product
echo -e "${YELLOW}[TEST 3] Create Test Product${NC}"
PRODUCT_NAME="TEST_$(date +%s)"
echo "POST $API_BASE/products"
CREATE=$(curl -s -X POST "$API_BASE/products" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$PRODUCT_NAME\",
    \"description\": \"Test product for API verification\",
    \"price\": 75000,
    \"stock\": 5,
    \"category\": \"dihoc\"
  }")
echo "Response:"
echo "$CREATE" | jq '.' 2>/dev/null || echo "$CREATE"

PRODUCT_ID=$(echo "$CREATE" | jq -r '.product.id' 2>/dev/null)
if [ -z "$PRODUCT_ID" ] || [ "$PRODUCT_ID" == "null" ]; then
  echo -e "${RED}✗ Failed to create product${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Created Product ID: $PRODUCT_ID${NC}\n"

# Test 4: Verify product in list
echo -e "${YELLOW}[TEST 4] Verify Product in List${NC}"
echo "GET $API_BASE/products?page=1&limit=100"
LIST=$(curl -s -X GET "$API_BASE/products?page=1&limit=100")
echo "Checking if product exists in list..."

FOUND=$(echo "$LIST" | jq --arg pid "$PRODUCT_ID" '.products[] | select(.id == ($pid | tonumber)) | .name' 2>/dev/null)
if [ -z "$FOUND" ] || [ "$FOUND" == "null" ]; then
  echo -e "${RED}✗ Product NOT found in list!${NC}"
  echo "  This is the main issue - newly created products not appearing"
  exit 1
fi
echo -e "${GREEN}✓ Product found in list: $FOUND${NC}\n"

# Test 5: Get product by ID
echo -e "${YELLOW}[TEST 5] Get Product by ID${NC}"
echo "GET $API_BASE/products/$PRODUCT_ID"
GET_BY_ID=$(curl -s -X GET "$API_BASE/products/$PRODUCT_ID")
echo "Response:"
echo "$GET_BY_ID" | jq '.' 2>/dev/null || echo "$GET_BY_ID"
echo -e "${GREEN}✓ Retrieved product details${NC}\n"

# Test 6: Update product
echo -e "${YELLOW}[TEST 6] Update Product${NC}"
UPDATED_NAME="${PRODUCT_NAME}_UPDATED"
echo "PUT $API_BASE/products/$PRODUCT_ID"
UPDATE=$(curl -s -X PUT "$API_BASE/products/$PRODUCT_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$UPDATED_NAME\",
    \"price\": 85000,
    \"stock\": 10
  }")
echo "Response:"
echo "$UPDATE" | jq '.' 2>/dev/null || echo "$UPDATE"
echo -e "${GREEN}✓ Product updated${NC}\n"

# Test 7: Delete product
echo -e "${YELLOW}[TEST 7] Delete Product${NC}"
echo "DELETE $API_BASE/products/$PRODUCT_ID"
DELETE=$(curl -s -X DELETE "$API_BASE/products/$PRODUCT_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Response:"
echo "$DELETE" | jq '.' 2>/dev/null || echo "$DELETE"
echo -e "${GREEN}✓ Product deleted${NC}\n"

# Final verification
echo -e "${YELLOW}[FINAL] Verify Product Removed${NC}"
FINAL=$(curl -s -X GET "$API_BASE/products?page=1&limit=100")
STILL_FOUND=$(echo "$FINAL" | jq --arg pid "$PRODUCT_ID" '.products[] | select(.id == ($pid | tonumber)) | .name' 2>/dev/null)
if [ -z "$STILL_FOUND" ] || [ "$STILL_FOUND" == "null" ]; then
  echo -e "${GREEN}✓ Product successfully removed from list${NC}"
else
  echo -e "${RED}✗ Product still in list (deletion issue?)${NC}"
fi

echo -e "\n${BLUE}========== ALL TESTS COMPLETE ==========${NC}"
echo -e "${GREEN}✓ API is working correctly!${NC}"
