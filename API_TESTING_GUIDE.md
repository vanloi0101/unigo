# 🔌 UNIGO BACKEND - API ENDPOINTS TEST GUIDE

**Backend URL:** `http://localhost:4000`  
**Status:** ✅ Running  
**Database:** ✅ PostgreSQL connected

---

## 📋 Complete API Endpoint List

### Total Endpoints: **16 APIs**

---

## 🔓 PUBLIC ENDPOINTS (No Authentication Required)

### 1️⃣ **Health Check**
```
GET http://localhost:4000/api/health
```
**Purpose:** Verify server is running  
**Response:**
```json
{
  "success": true,
  "message": "🚀 Server is running!",
  "timestamp": "2026-04-05T18:00:00.000Z"
}
```

---

### 2️⃣ **Database Check**
```
GET http://localhost:4000/api/db-check
```
**Purpose:** Verify database connection  
**Response:**
```json
{
  "success": true,
  "message": "✅ Database connection successful!",
  "database": "PostgreSQL",
  "timestamp": "2026-04-05T18:00:00.000Z"
}
```

---

## 👤 AUTHENTICATION / AUTH ROUTES

### 3️⃣ **Register New User**
```
POST http://localhost:4000/api/auth/register
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "✅ Đăng ký thành công!",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 4️⃣ **Login User**
```
POST http://localhost:4000/api/auth/login
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "✅ Đăng nhập thành công!",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 5️⃣ **Get User Profile** 🔒
```
GET http://localhost:4000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "message": "✅ Lấy thông tin người dùng thành công!",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER",
    "createdAt": "2026-04-05T18:00:00.000Z"
  }
}
```

---

### 6️⃣ **Logout User** 🔒
```
POST http://localhost:4000/api/auth/logout
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "message": "✅ Đăng xuất thành công!"
}
```

---

## 🛍️ PRODUCT ROUTES

### 7️⃣ **Get All Products** (With Search & Filters)
```
GET http://localhost:4000/api/products
```

**Query Parameters (Optional):**
```
?search=vòng tay
&category=dihoc
&minPrice=30000
&maxPrice=100000
&page=1
&limit=10
```

**Example:**
```
GET http://localhost:4000/api/products?search=vòng&category=dihoc&page=1&limit=5
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Vòng tay Thanh Lịch",
      "description": "Vòng tay handmade",
      "price": 50000,
      "imageUrl": "https://res.cloudinary.com/...",
      "stock": 10,
      "category": "dihoc",
      "createdAt": "2026-04-05T18:00:00.000Z"
    }
  ],
  "pagination": {
    "totalItems": 25,
    "totalPages": 3,
    "currentPage": 1,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 8️⃣ **Get Single Product by ID**
```
GET http://localhost:4000/api/products/:id
```

**Example:**
```
GET http://localhost:4000/api/products/1
```

**Response:**
```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Vòng tay Thanh Lịch",
    "description": "Vòng tay handmade từ hạt gỗ tự nhiên",
    "price": 50000,
    "imageUrl": "https://res.cloudinary.com/...",
    "stock": 10,
    "category": "dihoc",
    "createdAt": "2026-04-05T18:00:00.000Z"
  }
}
```

---

### 9️⃣ **Create Product** 🔒 (Admin Only)
```
POST http://localhost:4000/api/products
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Form Data:**
```
name: "Vòng tay mới"
description: "Sản phẩm handmade"
price: 75000
stock: 20
category: "dihoc"
imageFile: (binary image file)
```

**Using cURL:**
```bash
curl -X POST http://localhost:4000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Vòng tay mới" \
  -F "description=Sản phẩm handmade" \
  -F "price=75000" \
  -F "stock=20" \
  -F "category=dihoc" \
  -F "imageFile=@/path/to/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "✅ Sản phẩm được tạo thành công!",
  "product": {
    "id": 2,
    "name": "Vòng tay mới",
    "price": 75000,
    "imageUrl": "https://res.cloudinary.com/...",
    "stock": 20,
    "category": "dihoc"
  }
}
```

---

### 🔟 **Update Product** 🔒 (Admin Only)
```
PUT http://localhost:4000/api/products/:id
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Example:**
```
PUT http://localhost:4000/api/products/1
```

**Form Data (all optional):**
```
name: "Vòng tay nâng cấp"
description: "Cập nhật mô tả"
price: 60000
stock: 15
category: "tinhban"
imageFile: (new image file, optional)
```

**Using cURL:**
```bash
curl -X PUT http://localhost:4000/api/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Vòng tay nâng cấp" \
  -F "price=60000" \
  -F "imageFile=@/path/to/new-image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "✅ Sản phẩm được cập nhật thành công!",
  "product": {
    "id": 1,
    "name": "Vòng tay nâng cấp",
    "price": 60000,
    "stock": 15
  }
}
```

---

### 1️⃣1️⃣ **Delete Product** 🔒 (Admin Only)
```
DELETE http://localhost:4000/api/products/:id
Authorization: Bearer ADMIN_TOKEN
```

**Example:**
```
DELETE http://localhost:4000/api/products/1
```

**Response:**
```json
{
  "success": true,
  "message": "✅ Sản phẩm được xóa thành công!"
}
```

---

## 📦 ORDER ROUTES (All Protected 🔒)

### 1️⃣2️⃣ **Create Order**
```
POST http://localhost:4000/api/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "✅ Đơn hàng được tạo thành công!",
  "order": {
    "id": 1,
    "userId": 1,
    "totalAmount": 175000,
    "status": "PENDING",
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 50000
      }
    ],
    "createdAt": "2026-04-05T18:00:00.000Z"
  }
}
```

---

### 1️⃣3️⃣ **Get User's Orders**
```
GET http://localhost:4000/api/orders
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters (Optional):**
```
?page=1
&limit=10
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": 1,
      "userId": 1,
      "totalAmount": 175000,
      "status": "PENDING",
      "createdAt": "2026-04-05T18:00:00.000Z",
      "items": [...]
    }
  ],
  "pagination": {
    "totalItems": 5,
    "totalPages": 1,
    "currentPage": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### 1️⃣4️⃣ **Get Single Order by ID**
```
GET http://localhost:4000/api/orders/:id
Authorization: Bearer YOUR_TOKEN
```

**Example:**
```
GET http://localhost:4000/api/orders/1
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": 1,
    "userId": 1,
    "totalAmount": 175000,
    "status": "PENDING",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "quantity": 2,
        "price": 50000,
        "product": {
          "id": 1,
          "name": "Vòng tay Thanh Lịch",
          "imageUrl": "https://res.cloudinary.com/..."
        }
      }
    ],
    "createdAt": "2026-04-05T18:00:00.000Z"
  }
}
```

---

### 1️⃣5️⃣ **Get All Orders** 🔒 (Admin Only)
```
GET http://localhost:4000/api/orders/admin/all
Authorization: Bearer ADMIN_TOKEN
```

**Query Parameters (Optional):**
```
?page=1
&limit=20
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": 1,
      "userId": 1,
      "user": {
        "email": "user@example.com",
        "firstName": "John"
      },
      "totalAmount": 175000,
      "status": "PENDING",
      "createdAt": "2026-04-05T18:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

---

### 1️⃣6️⃣ **Update Order Status** 🔒 (Admin Only)
```
PUT http://localhost:4000/api/orders/:id/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "status": "PROCESSING"
}
```

**Valid Status Values:**
- `PENDING` - Chờ xử lý
- `PROCESSING` - Đang xử lý
- `SHIPPED` - Đã gửi
- `DELIVERED` - Đã giao
- `CANCELLED` - Đã hủy

**Example:**
```
PUT http://localhost:4000/api/orders/1/status
```

**Response:**
```json
{
  "success": true,
  "message": "✅ Trạng thái đơn hàng được cập nhật!",
  "order": {
    "id": 1,
    "status": "PROCESSING",
    "updatedAt": "2026-04-05T18:00:00.000Z"
  }
}
```

---

## 🧪 Quick Test Using PowerShell / curl

### Test 1: Health Check
```powershell
curl http://localhost:4000/api/health
```

### Test 2: Database Check
```powershell
curl http://localhost:4000/api/db-check
```

### Test 3: Register User
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

curl -X POST http://localhost:4000/api/auth/register `
  -H "Content-Type: application/json" `
  -d $body
```

### Test 4: Login
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = curl -X POST http://localhost:4000/api/auth/login `
  -H "Content-Type: application/json" `
  -d $body | ConvertFrom-Json

$token = $response.token
```

### Test 5: Get Products
```powershell
curl http://localhost:4000/api/products
```

---

## 📊 API Summary Table

| # | Endpoint | Method | Auth | Purpose |
|----|----------|--------|------|---------|
| 1 | `/api/health` | GET | ❌ | Health check |
| 2 | `/api/db-check` | GET | ❌ | Database test |
| 3 | `/api/auth/register` | POST | ❌ | Register account |
| 4 | `/api/auth/login` | POST | ❌ | Login |
| 5 | `/api/auth/profile` | GET | 🔒 | Get profile |
| 6 | `/api/auth/logout` | POST | 🔒 | Logout |
| 7 | `/api/products` | GET | ❌ | List products |
| 8 | `/api/products/:id` | GET | ❌ | Get product |
| 9 | `/api/products` | POST | 🔒 | Create product (admin) |
| 10 | `/api/products/:id` | PUT | 🔒 | Update product (admin) |
| 11 | `/api/products/:id` | DELETE | 🔒 | Delete product (admin) |
| 12 | `/api/orders` | POST | 🔒 | Create order |
| 13 | `/api/orders` | GET | 🔒 | Get my orders |
| 14 | `/api/orders/:id` | GET | 🔒 | Get order detail |
| 15 | `/api/orders/admin/all` | GET | 🔒 | All orders (admin) |
| 16 | `/api/orders/:id/status` | PUT | 🔒 | Update status (admin) |

---

## 🔐 Authentication Note

**Bearer Token Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get token from:
- Login endpoint (`/api/auth/login`)
- Register endpoint (`/api/auth/register`)

**Token Expiration:** 7 days

---

## ✅ Testing Checklist

- [ ] Health check working
- [ ] Database connection OK
- [ ] Can register account
- [ ] Can login
- [ ] Can get profile
- [ ] Can logout
- [ ] Can list products
- [ ] Can get single product
- [ ] Can search/filter products
- [ ] Can create product (admin)
- [ ] Can update product (admin)
- [ ] Can delete product (admin)
- [ ] Can create order
- [ ] Can get orders
- [ ] Can get order detail
- [ ] Can update order status (admin)

---

**Backend:** ✅ Ready for testing  
**Database:** ✅ Ready  
**All APIs:** ✅ Functional

Happy Testing! 🚀
