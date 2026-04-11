# ✅ FRONTEND API CONNECTION STATUS

**Date:** April 5, 2026  
**Status:** ✅ **CONFIGURED & READY**

---

## 📊 Current Setup

### **Backend Server**
```
✅ Status: RUNNING
🔌 Port: 4000
🔗 URL: http://localhost:4000
```

### **Frontend Server**
```
⏳ Status: READY (needs npm run dev)
🔌 Port: 5173
🔗 URL: http://localhost:5173
```

### **Frontend ↔ Backend Connection**
```
✅ Configuration: COMPLETE
✅ API Base URL: http://localhost:4000/api
✅ Environment Variable: VITE_API_URL configured
✅ Axios Client: Configured with interceptors
✅ Token Management: localStorage-based JWT
```

---

## 🔌 API Connection Configuration

### **File: `.env` (Frontend)**
```
VITE_API_URL=http://localhost:4000/api
```

### **File: `src/api/axiosClient.js`**
```javascript
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attaches token from localStorage
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **File: `src/api/apiServices.js`**
```javascript
export const authAPI = {
  register: (email, password, name) => axiosClient.post('/auth/register', ...),
  login: (email, password) => axiosClient.post('/auth/login', ...),
  getProfile: () => axiosClient.get('/auth/profile'),
  logout: () => axiosClient.post('/auth/logout'),
};

export const productAPI = {
  getAll: (page, limit, category) => axiosClient.get('/products', ...),
  getById: (id) => axiosClient.get(`/products/${id}`),
  create: (productData) => axiosClient.post('/products', ...),
  update: (id, productData) => axiosClient.put(`/products/${id}`, ...),
  delete: (id) => axiosClient.delete(`/products/${id}`),
};

export const orderAPI = {
  create: (items, shippingAddress) => axiosClient.post('/orders', ...),
  getUserOrders: (page, limit) => axiosClient.get('/orders', ...),
  getById: (id) => axiosClient.get(`/orders/${id}`),
  getAllOrders: (page, limit, status) => axiosClient.get('/orders/admin/all', ...),
};
```

---

## 📱 Pages Using API

### **Login Page** (`pages/Login.jsx`)
```javascript
✅ API Call: axiosClient.post('/auth/login', { email, password })
✅ Token Storage: Saved to localStorage
✅ Redirect: Auto-login detection & redirect to admin
✅ Error Handling: Toast notifications
```

### **Admin Products Page** (`pages/AdminProducts.jsx`)
```javascript
✅ API Calls:
   - GET /api/products (list & search)
   - POST /api/products (create with image)
   - PUT /api/products/:id (update with image)
   - DELETE /api/products/:id (delete)
✅ Features: Search, filter, pagination
✅ Image Upload: Multipart form data
```

### **Admin Orders Page** (`pages/AdminOrders.jsx`)
```javascript
✅ API Calls:
   - GET /api/orders/admin/all (list orders)
   - PUT /api/orders/:id/status (update status)
✅ Features: Order status tracking
```

### **Home Page** (`pages/Home.jsx`)
```javascript
✅ API Call: GET /api/products (fetch products)
✅ Features: Display product grid
```

---

## 🔄 API Flow Diagram

```
┌─────────────────────────────────────────┐
│         Frontend (React)                 │
│      http://localhost:5173               │
└────────────────┬────────────────────────┘
                 │
                 │ HTTP/JSON
                 │
     ┌───────────▼──────────────┐
     │  Axios Client            │
     │ (with JWT interceptor)   │
     │  VITE_API_URL env var    │
     └───────────┬──────────────┘
                 │
                 │ Request with Authorization header
                 │
┌────────────────▼──────────────────────────┐
│        Backend (Express)                   │
│       http://localhost:4000/api            │
│                                            │
│  ✅ Auth Routes (/auth)                   │
│  ✅ Product Routes (/products)            │
│  ✅ Order Routes (/orders)                │
│  ✅ Health Check (/health)                │
│  ✅ Database Check (/db-check)            │
└────────────────┬──────────────────────────┘
                 │
                 │
     ┌───────────▼──────────────┐
     │   PostgreSQL Database    │
     │  (users, products,       │
     │   orders, orderitems)    │
     └──────────────────────────┘
```

---

## ✅ Checklist - Frontend API Integration

- [x] **Axios Client** - Configured with baseURL
- [x] **API Services** - All endpoints defined (authAPI, productAPI, orderAPI)
- [x] **Environment Variable** - VITE_API_URL set to `http://localhost:4000/api`
- [x] **Token Management** - JWT stored in localStorage
- [x] **Request Interceptor** - Auto-attach token to requests
- [x] **Response Interceptor** - Handle errors & responses
- [x] **Login Page** - Uses API for authentication
- [x] **Product Pages** - Use API for CRUD operations
- [x] **Order Pages** - Use API for order management
- [x] **Error Handling** - Toast notifications for errors
- [x] **Loading States** - Show spinners during API calls

---

## 🚀 How to Start Full Stack

### **Terminal 1 - Backend (Port 4000)**
```bash
cd C:\Users\vanlo\all\webapp\unigo\src\backend
npm run dev
```

### **Terminal 2 - Frontend (Port 5173)**
```bash
cd C:\Users\vanlo\all\webapp\unigo\src\frontend
npm run dev
```

**⏳ Important:** Frontend must restart after `.env` changes to load the new API URL!

---

## 🧪 Testing API Connection

### **Method 1: Browser Console**
```javascript
// In browser console (Ctrl+Shift+J):
const response = await fetch('http://localhost:4000/api/health');
console.log(await response.json());
// Should show: {"success":true,"message":"🚀 Server is running!"}
```

### **Method 2: Test Login Flow**
1. Open http://localhost:5173
2. Go to Login page
3. Register new account
4. Login with credentials
5. Check if token appears in localStorage:
   ```javascript
   // Console:
   console.log(localStorage.getItem('token'));
   ```

### **Method 3: Check Axios Instance**
```javascript
// In frontend (after importing):
import axiosClient from './api/axiosClient';
console.log(axiosClient.defaults.baseURL);
// Should show: http://localhost:4000/api
```

---

## 🔐 Token Management

### **Storage Location**
```javascript
localStorage.getItem('token')  // JWT token
```

### **Auto-Attach to Requests**
```javascript
// All requests automatically include:
Authorization: Bearer <token>
```

### **Remove on Logout**
```javascript
localStorage.removeItem('token')
```

---

## 📊 API Connection Examples

### **Register User**
```javascript
import { authAPI } from '../api/apiServices';

// Frontend calls
const response = await authAPI.register('test@example.com', 'password', 'Test User');
// Request: POST http://localhost:4000/api/auth/register
// Response: { token, user, success }
```

### **Login User**
```javascript
import { authAPI } from '../api/apiServices';

// Frontend calls
const response = await authAPI.login('test@example.com', 'password');
// Request: POST http://localhost:4000/api/auth/login
// Response: { token, user, success }
```

### **Get Products**
```javascript
import { productAPI } from '../api/apiServices';

// Frontend calls
const response = await productAPI.getAll(1, 10, 'dihoc');
// Request: GET http://localhost:4000/api/products?page=1&limit=10&category=dihoc
// Response: { products, pagination, success }
```

### **Create Order**
```javascript
import { orderAPI } from '../api/apiServices';

// Frontend calls
const response = await orderAPI.create([
  { productId: 1, quantity: 2 }
]);
// Request: POST http://localhost:4000/api/orders
// Headers: Authorization: Bearer <token>
// Response: { order, success }
```

---

## ⚙️ Configuration Files Updated

| File | Status | Changes |
|------|--------|---------|
| `.env` | ✅ Updated | Added VITE_API_URL=http://localhost:4000/api |
| `axiosClient.js` | ✅ Ready | Configured with interceptors |
| `apiServices.js` | ✅ Ready | All endpoints defined |
| `useAuthStore.js` | ✅ Ready | Zustand store for auth |
| `useProductStore.js` | ✅ Ready | Zustand store for products |
| `useOrderStore.js` | ✅ Ready | Zustand store for orders |
| `useCartStore.js` | ✅ Ready | Zustand store for cart |

---

## 🎯 Next Steps

1. **Start Backend** (if not running):
   ```bash
   cd src/backend
   npm run dev  # Port 4000
   ```

2. **Start Frontend** (in new terminal):
   ```bash
   cd src/frontend
   npm run dev  # Port 5173
   ```

3. **Access Application**:
   ```
   http://localhost:5173
   ```

4. **Test API Connection**:
   - Register new account
   - Login
   - Check token in localStorage
   - Browse products
   - Create order

---

## ✅ Status Summary

| Aspect | Status |
|--------|--------|
| **API Base URL** | ✅ Configured (http://localhost:4000/api) |
| **Axios Setup** | ✅ Complete with interceptors |
| **Token Management** | ✅ localStorage-based JWT |
| **API Services** | ✅ All endpoints defined |
| **Frontend Pages** | ✅ Integrated with API calls |
| **Error Handling** | ✅ Toast notifications |
| **Environment Variables** | ✅ .env updated |
| **Ready to Test** | ✅ Yes! |

---

## 🎉 FRONTEND & BACKEND ARE CONNECTED!

Both services are configured and ready to communicate.

**Backend:** ✅ Running on http://localhost:4000  
**Frontend:** ✅ Configured to connect to backend  
**Database:** ✅ PostgreSQL initialized  

Start the frontend with `npm run dev` and enjoy! 🚀

