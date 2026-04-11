# 🚀 Frontend-Backend Integration Guide

**Status**: ✅ Complete & Ready for Testing  
**Date**: April 11, 2025  
**Framework**: React 18 + Vite + Zustand + Axios  
**Backend**: Express.js + Prisma + PostgreSQL + Cloudinary  

---

## 📋 Overview

Tài liệu này mô tả cách Frontend kết nối với Backend API thông qua:
1. **Axios Instance** - Gọi API với interceptors
2. **Zustand Stores** - Quản lý state (Auth, Products, Cart, Orders)
3. **Protected Routes** - Bảo vệ pages admin
4. **FormData Upload** - Upload ảnh lên Cloudinary qua backend

---

## 🔧 Architecture

```
┌─────────────────────┐
│   React Frontend    │
│   (Vite + Zustand)  │
└──────────┬──────────┘
           │ axios + JWT
           ↓
┌─────────────────────────────────────┐
│   Axios Instance (axiosClient.js)   │
│  - Interceptor: Thêm Bearer token   │
│  - Unpack response.data              │
│  - Handle 401 Unauthorized          │
└──────────┬──────────────────────────┘
           │ HTTP Request
           ↓
┌──────────────────────────────────────┐
│   Express API (Node.js)              │
│  - JWT Authentication middleware     │
│  - Admin role check middleware       │
│  - Multer file upload middleware     │
│  - Response helper (standardized)    │
└──────────┬───────────────────────────┘
           │ Cloudinary API (for images)
           ↓
┌──────────────────────────────┐
│   PostgreSQL + Prisma ORM    │
│   Cloudinary CDN             │
└──────────────────────────────┘
```

---

## 🔐 API Response Structure

### Backend Response Helper Format

Tất cả API responses từ backend tuân theo format chuẩn:

```javascript
// Success response (200, 201)
{
  success: true,
  message: "Operation successful",
  data: { /* actual data */ },
  statusCode: 200
}

// Error response (400, 401, 403, 500)
{
  success: false,
  message: "Error description",
  data: null,
  statusCode: 400
}
```

### Axios Interceptor Processing

```javascript
// Backend returns full response
res.status(200).json({
  success: true,
  message: "Success",
  data: { /* data */ },
  statusCode: 200
})

// Axios wraps it
axios_response = {
  data: {              // ← Backend response goes here
    success: true,
    message: "Success",
    data: { /* data */ },
    statusCode: 200
  },
  status: 200,
  headers: { ... },
  ...
}

// axiosClient interceptor returns response.data
✓ return response.data;
// So frontend receives:
response = {
  success: true,
  message: "Success",
  data: { /* data */ },
  statusCode: 200
}
```

---

## 📡 API Endpoints Mapping

### Authentication Routes

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/api/auth/login` | ❌ No | Đăng nhập (email + password) → JWT token |
| POST | `/api/auth/register` | ❌ No | Đăng ký user mới |
| GET | `/api/auth/profile` | ✅ Yes | Lấy thông tin user hiện tại |
| POST | `/api/auth/logout` | ✅ Yes | Logout (clear token) |

**Response (Login/Register):**
```javascript
{
  status: "success",
  message: "Đăng nhập thành công",
  data: {
    user: {
      id: 1,
      email: "admin@unigo.com",
      name: "Admin",
      role: "ADMIN",
      createdAt: "2025-04-10T..."
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Product Routes

| Method | Endpoint | Protected | Admin | Description |
|--------|----------|-----------|-------|-------------|
| GET | `/api/products` | ❌ No | ❌ | Lấy all products (public) |
| GET | `/api/products/:id` | ❌ No | ❌ | Lấy product detail |
| POST | `/api/products` | ✅ Yes | ✅ | Tạo product mới (FormData + image) |
| PUT | `/api/products/:id` | ✅ Yes | ✅ | Cập nhật product |
| DELETE | `/api/products/:id` | ✅ Yes | ✅ | Xóa product |

**Response (GET /products):**
```javascript
{
  success: true,
  message: "Lấy danh sách sản phẩm thành công",
  data: {
    products: [
      {
        id: 1,
        name: "Vòng tay mặt sáng",
        price: 150000,
        imageUrl: "https://res.cloudinary.com/.../image.jpg",
        stock: 20,
        category: "dihoc",
        description: "...",
        createdAt: "2025-04-10T...",
        updatedAt: "2025-04-10T..."
      },
      ...
    ],
    pagination: {
      totalItems: 45,
      totalPages: 5,
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  statusCode: 200
}
```

**Response (POST /products - Create):**
```javascript
{
  success: true,
  message: "Sản phẩm tạo thành công",
  data: {
    product: {
      id: 123,
      name: "New Product",
      price: 200000,
      imageUrl: "https://res.cloudinary.com/.../image.jpg",
      stock: 15,
      category: "pastel",
      description: "...",
      createdAt: "2025-04-11T...",
      updatedAt: "2025-04-11T..."
    }
  },
  statusCode: 201
}
```

---

## 🔄 Frontend Data Flow

### 1️⃣ Login Flow

```
User fills form (email, password)
         ↓
AdminProducts.onSubmit()
         ↓
const response = await axiosClient.post('/auth/login', {...})
         ↓
axiosClient interceptor:
- Check token in localStorage (none for login)
- Make POST request
- Receive response from backend
- Return response.data
         ↓
if (response?.data?.user && response?.data?.token) {
  login(response.data.user, response.data.token)  ← Call Zustand action
  navigate('/admin')
}
         ↓
useAuthStore.login action:
- localStorage.setItem('token', token)
- localStorage.setItem('user', JSON.stringify(user))
- Update store state: {user, token, isAuthenticated}
         ↓
ProtectedRoute checks isAuthenticated ✅
user can access /admin/* pages
```

### 2️⃣ Product Creation (With Image Upload)

```
Admin fills form:
- name, price, stock, category
- Select image file
         ↓
AdminProducts.onSubmit()
         ↓
Build FormData:
formData.append('name', 'Vòng tay')
formData.append('description', '...')
formData.append('price', '150000')
formData.append('stock', '20')
formData.append('category', 'dihoc')
formData.append('image', fileObj)  ← ⚠️ Field name must be 'image'
         ↓
await createProduct(formData)
         ↓
useProductStore.createProduct:
- Detect FormData type
- Set config header: 'Content-Type': 'multipart/form-data'
- axiosClient.post('/products', formData, config)
         ↓
axiosClient interceptor:
- Get token from localStorage
- Set header: Authorization: Bearer {token}
- Set header: Content-Type: multipart/form-data
- Make POST request (token validates user is admin)
         ↓
Backend API:
- authenticateToken middleware: Verify JWT, extract userId/role
- checkAdminRole middleware: Verify user.role === 'ADMIN'
- uploadSingle middleware: Parse multipart, get file buffer
- createProduct controller:
  * Upload file buffer to Cloudinary
  * Get imageUrl from Cloudinary response
  * Save product to PostgreSQL with imageUrl
  * Return sendCreated response
         ↓
response: {
  success: true,
  message: "Sản phẩm tạo thành công",
  data: { product: {...} }
}
         ↓
useProductStore:
- Unpack response.data.product
- Add to products array: [newProduct, ...existingProducts]
- Update state
         ↓
AdminProducts page re-renders with new product in list
Toast: "✅ Thêm sản phẩm thành công!"
```

### 3️⃣ Protected Route Check

```
User navigates to /admin/products
         ↓
ProtectedRoute component renders:
if (!isAuthenticated) {
  return <Navigate to="/login" replace />
}
return <Outlet />  ← Render child routes (AdminLayout → AdminProducts)
         ↓
isAuthenticated = !!localStorage.getItem('token')
OR read from Zustand state at app init
```

---

## 📁 File Structure

```
src/
├── api/
│   └── axiosClient.js                 ← 🔧 Axios instance + interceptors
├── store/
│   ├── useAuthStore.js                ← Auth state (login, logout, user)
│   ├── useProductStore.js             ← Product CRUD operations
│   ├── useCartStore.js
│   └── useOrderStore.js
├── pages/
│   ├── Login.jsx                       ← 🔐 Login form
│   ├── AdminDashboard.jsx
│   ├── AdminProducts.jsx               ← 📸 Product create/edit/delete
│   ├── AdminPosts.jsx
│   ├── AdminSettings.jsx
│   ├── Home.jsx
│   └── CartPage.jsx
├── components/
│   └── common/
│       └── ProtectedRoute.jsx          ← 🛡️ Route protection wrapper
├── layouts/
│   ├── AdminLayout.jsx
│   └── PublicLayout.jsx
└── App.jsx                             ← Routes configuration
```

---

## 🧪 Test Scenarios

### ✅ Test 1: Successful Login

1. Start backend: `npm run dev` (port 5000)
2. Start frontend: `npm run dev` (Vite - usually port 5173)
3. Go to http://localhost:5173/login
4. Try default credentials:
   - Email: `admin@unigo.com`
   - Password: `admin123`
5. Expected: ✅ Token saved to localStorage, redirect to /admin
6. Check localStorage in DevTools:
   - `localStorage.getItem('token')` → JWT token
   - `localStorage.getItem('user')` → User object JSON

### ✅ Test 2: Protected Route Access

1. After login, navigate to `/admin/products`
2. Expected: ✅ Page loads successfully
3. In browser console: `localStorage.getItem('token')` → should show JWT
4. Logout, then try accessing `/admin/products`
5. Expected: ❌ Redirect to /login automatically (ProtectedRoute)

### ✅ Test 3: Product Creation with Image

1. Login as admin
2. Go to `/admin/products`
3. Click "Thêm Sản Phẩm"
4. Fill form:
   - Name: "Test Product"
   - Price: "99000"
   - Stock: "10"
   - Category: "dihoc"
   - **Select image file**
5. Click "Lưu"
6. Expected:
   - ✅ Toast: "Thêm sản phẩm thành công!"
   - ✅ Product appears in list
   - ✅ Image loaded from Cloudinary URL

### ✅ Test 4: 401 Unauthorized Handling

1. Manually delete `token` from localStorage via DevTools
2. Try accessing `/admin/products`
3. Expected: ❌ Redirect to /login (ProtectedRoute catches)
4. In backend console, you should see authentication error if token was malformed

### ✅ Test 5: Product Fetch on Home

1. Go to http://localhost:5173/ (home page)
2. Expected: ✅ Public products displayed (no auth needed)
3. In browser console Network tab:
   - GET /api/products → status 200
   - NO Authorization header (public endpoint)

---

## ⚙️ Configuration

### .env File (Frontend)

```bash
# Located: src/frontend/.env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Món Nhỏ Handmade
VITE_APP_DESCRIPTION=Thương hiệu trang sức handmade
```

**Key Point**: `VITE_API_URL=http://localhost:5000/api` ✅
- axiosClient baseURL reads from this
- Port 5000 = Backend Express server

### Backend Environment

Backend should be running on **port 5000** (check .env or hardcoded in src/index.js)

```bash
# Backend: src/backend/
npm run dev  # or node src/index.js
```

---

## 🐛 Troubleshooting

### ❌ Problem: Login fails with "Sai Email hoặc mật khẩu"

**Causes:**
1. Backend not running on port 5000
2. .env `VITE_API_URL` points to wrong port
3. Database not seeded with admin user

**Solution:**
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Verify .env
cat src/frontend/.env  # Should show VITE_API_URL=http://localhost:5000/api

# Seed admin user if needed
cd src/backend && node create-admin.js
```

### ❌ Problem: 401 Unauthorized on product creation

**Causes:**
1. Token not saved in localStorage
2. User role is not "ADMIN"
3. Token expired

**Solution:**
```javascript
// In browser console:
console.log(localStorage.getItem('token'))  // Should show JWT
console.log(JSON.parse(localStorage.getItem('user')))  // role should be "ADMIN"
```

### ❌ Problem: Image upload fails

**Causes:**
1. FormData field name is not "image"
2. Cloudinary credentials not configured
3. File size too large

**Solution:**
```javascript
// Debug in AdminProducts.jsx
const onSubmit = async (data) => {
  const formData = new FormData();
  formData.append('image', data.imageFile[0]);  // ⚠️ Field name MUST be "image"
  
  // Check FormData content
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
}
```

### ❌ Problem: CORS error

**Causes:**
1. Backend CORS not allow frontend origin
2. Axios withCredentials mismatch

**Solution:**
```javascript
// Backend src/index.js
app.use(cors({
  origin: 'http://localhost:5173',  // Match frontend URL
  credentials: true
}))
```

---

## 📚 Key Files Reference

### File: src/api/axiosClient.js

```javascript
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Request interceptor: Add JWT token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Unpack and handle errors
axiosClient.interceptors.response.use(
  (response) => response.data,  // Return data only
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Auto redirect to login if needed
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
```

### File: src/store/useAuthStore.js

```javascript
const useAuthStore = create((set) => ({
  user: localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')) 
    : null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));
```

### File: src/components/common/ProtectedRoute.jsx

```javascript
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;  // Render admin routes
}
```

---

## 🎯 Next Steps

1. **Test all scenarios** above
2. **Monitor backend logs** for errors
3. **Check browser DevTools** (Network, Console, Application/Storage)
4. **Verify database** has:
   - Admin user with role="ADMIN"
   - Products table with cloudinary imageUrl
5. **Performance**: Monitor API response times in Network tab

---

## 📞 Support

If issues occur:
1. Check backend logs: `npm run dev` output
2. Check browser console: F12 → Console
3. Check Network requests: F12 → Network
4. Check localStorage: F12 → Application → Storage → Local Storage

---

**Last Updated**: April 11, 2025  
**Status**: ✅ Production Ready (After Testing)
