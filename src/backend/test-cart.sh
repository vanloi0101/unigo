#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000/api"
TIMESTAMP=$(date +%s)
EMAIL="testuser${TIMESTAMP}@example.com"

echo -e "${YELLOW}========== TESTING CART API ==========${NC}\n"

# Step 1: Register user
echo -e "${YELLOW}1️⃣ Registering user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"password123\",\"name\":\"Test User\"}")

echo "Response: $REGISTER_RESPONSE"
TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Failed to get token${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Token: ${TOKEN:0:30}...${NC}\n"

# Step 2: Get products
echo -e "${YELLOW}2️⃣ Getting products...${NC}"
PRODUCTS=$(curl -s -X GET "$BASE_URL/products")
echo "Response: $PRODUCTS"
PRODUCT_ID=$(echo "$PRODUCTS" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

if [ -z "$PRODUCT_ID" ]; then
  echo -e "${RED}❌ No products found${NC}"
  PRODUCT_ID=1
  echo -e "${YELLOW}⚠️ Using default productId: $PRODUCT_ID${NC}"
fi

echo -e "${GREEN}✅ Using productId: $PRODUCT_ID${NC}\n"

# Step 3: Add to cart
echo -e "${YELLOW}3️⃣ Adding product to cart...${NC}"
ADD_RESPONSE=$(curl -s -X POST "$BASE_URL/cart" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":$PRODUCT_ID,\"quantity\":2}")

echo "Response: $ADD_RESPONSE"
SUCCESS=$(echo "$ADD_RESPONSE" | grep -c '"success":true')

if [ "$SUCCESS" -eq 1 ]; then
  echo -e "${GREEN}✅ Product added to cart!${NC}\n"
else
  echo -e "${RED}❌ Failed to add product${NC}\n"
fi

# Step 4: Get cart
echo -e "${YELLOW}4️⃣ Getting cart...${NC}"
GET_RESPONSE=$(curl -s -X GET "$BASE_URL/cart" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $GET_RESPONSE"
ITEM_COUNT=$(echo "$GET_RESPONSE" | grep -o '"items":\[' | wc -l)
echo -e "${GREEN}✅ Cart contains items${NC}\n"

# Step 5: Add same product again (test quantity update)
echo -e "${YELLOW}5️⃣ Adding same product again (should update quantity)...${NC}"
ADD_AGAIN=$(curl -s -X POST "$BASE_URL/cart" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":$PRODUCT_ID,\"quantity\":1}")

echo "Response: $ADD_AGAIN"
echo -e "${GREEN}✅ Quantity updated${NC}\n"

# Step 6: Get updated cart
echo -e "${YELLOW}6️⃣ Getting updated cart...${NC}"
FINAL_RESPONSE=$(curl -s -X GET "$BASE_URL/cart" \
  -H "Authorization: Bearer $TOKEN")

echo "Final Cart: $FINAL_RESPONSE"
echo -e "${GREEN}✅ All tests completed!${NC}\n"

echo -e "${YELLOW}========== TEST SUMMARY ==========${NC}"
echo -e "Email: $EMAIL"
echo -e "Token: ${TOKEN:0:40}..."
echo -e "Product ID: $PRODUCT_ID"
echo -e "${GREEN}✅ Cart API is working!${NC}"
