# 🚀 Unigo - Setup & Deployment Guide

## **Backend Setup (Node.js + Express + PostgreSQL)**

### 1️⃣ Prerequisites
- Node.js v16+ installed
- PostgreSQL running locally or Docker
- Git installed

### 2️⃣ Environment Setup

```bash
cd src/backend

# Copy environment file
cp .env.example .env

# Edit .env với thông tin database của bạn
# DATABASE_URL="postgresql://user:password@localhost:5432/unigo_db?schema=public"
# PORT=5000
# JWT_SECRET=your_secret_key_here
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Database Migration

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) View database with Prisma Studio
npm run prisma:studio
```

### 5️⃣ Start Backend

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start

# Server will run on http://localhost:5000
```

### 6️⃣ Test API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Database check
curl http://localhost:5000/api/db-check

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Get products
curl http://localhost:5000/api/products
```

---

## **Frontend Setup (React + Vite + Tailwind)**

### 1️⃣ Environment Setup

```bash
cd src/frontend

# Copy environment file
cp .env.example .env

# Configure API URL (should match backend URL)
# VITE_API_URL=http://localhost:5000/api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start Development Server

```bash
npm run dev

# Frontend will run on http://localhost:5173
```

### 4️⃣ Build for Production

```bash
npm run build

# Preview production build
npm run preview
```

---

## **Database Schema**

```
User (ADMIN, CUSTOMER)
  ├── id (PK)
  ├── email (UNIQUE)
  ├── password (hashed)
  ├── name
  ├── role (ENUM)
  └── timestamps

Product
  ├── id (PK)
  ├── name
  ├── description
  ├── price
  ├── imageUrl
  ├── stock
  ├── category
  └── timestamps

Order
  ├── id (PK)
  ├── userId (FK)
  ├── totalAmount
  ├── status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
  ├── shippingAddress
  ├── items (OrderItem[])
  └── timestamps

OrderItem
  ├── id (PK)
  ├── orderId (FK)
  ├── productId (FK)
  ├── quantity
  ├── price (at time of order)
  └── unique(orderId, productId)
```

---

## **API Endpoints Summary**

### **Authentication**
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/profile         - Get current user profile (Protected)
POST   /api/auth/logout          - Logout (Protected)
```

### **Products**
```
GET    /api/products             - Get all products (with pagination & filtering)
GET    /api/products/:id         - Get product by ID
POST   /api/products             - Create product (Admin only)
PUT    /api/products/:id         - Update product (Admin only)
DELETE /api/products/:id         - Delete product (Admin only)
```

### **Orders**
```
POST   /api/orders               - Create order (Protected)
GET    /api/orders               - Get user's orders (Protected)
GET    /api/orders/:id           - Get order details (Protected)
GET    /api/orders/admin/all     - Get all orders (Admin only)
PUT    /api/orders/:id/status    - Update order status (Admin only)
```

---

## **Frontend Features Implemented**

✅ **Authentication**
- Login with validation
- Protected routes
- Token-based authorization
- Auto-redirect if already logged in

✅ **Product Management**
- Fetch products from API
- Add/Edit/Delete products (Admin)
- Category filtering
- Search functionality
- Loading skeletons
- Error handling

✅ **State Management (Zustand)**
- `useAuthStore` - Authentication state
- `useCartStore` - Shopping cart
- `useProductStore` - Products data
- `useOrderStore` - Orders management

✅ **Form Validation**
- React Hook Form + Zod
- Real-time error messages
- Loading states on submit

✅ **Notifications**
- Toast notifications (react-hot-toast)
- Success/Error messages
- Auto-dismiss

---

## **Backend Features Implemented**

✅ **Authentication**
- User registration with password hashing (bcryptjs)
- JWT-based login
- Token verification middleware
- Protected routes

✅ **Products API**
- Fetch all products with pagination
- Get product by ID
- Create/Update/Delete (Admin only)
- Category filtering

✅ **Orders API**
- Create orders
- Get user's orders
- Get all orders (Admin)
- Update order status (Admin)
- Stock validation

✅ **Security**
- Password hashing with bcryptjs
- JWT authentication
- CORS configuration
- Input validation with express-validator

---

## **Development Workflow**

### Backend Development
```bash
cd src/backend

# Terminal 1: Watch changes
npm run dev

# Terminal 2: Check database
npm run prisma:studio

# Terminal 3: Run migrations when schema changes
npm run prisma:migrate
```

### Frontend Development
```bash
cd src/frontend

# Terminal 1: Dev server
npm run dev

# Terminal 2: Monitor changes
# (VSCode will auto-reload in browser)
```

---

## **Testing Credentials**

Once you've created a user through the register endpoint, use those credentials to login.

**Example:**
```json
{
  "email": "admin@monnho.com",
  "password": "secure_password_here"
}
```

---

## **Common Issues & Solutions**

### 1. **Database Connection Failed**
```
Error: ECONNREFUSED PostgreSQL
Solution: Ensure PostgreSQL is running
         Update DATABASE_URL in .env
```

### 2. **Port Already in Use**
```
Error: listen EADDRINUSE :::5000
Solution: Change PORT in .env or kill process
         lsof -i :5000 (Mac/Linux)
         netstat -ano | findstr :5000 (Windows)
```

### 3. **CORS Error**
```
Error: No 'Access-Control-Allow-Origin' header
Solution: Ensure CORS_ORIGIN in backend .env matches frontend URL
         Check network in browser DevTools
```

### 4. **Token Expired**
```
Error: Token tidak hợp lệ hoặc đã hết hạn
Solution: Token expires in 7 days by default
         Login again to get new token
         Change JWT_EXPIRE in backend .env if needed
```

### 5. **Prisma Schema Not Synced**
```
Error: Database doesn't have necessary tables
Solution: Run npm run prisma:migrate
         Or npm run prisma:reset to reset all data
```

---

## **Deployment (Optional - Phase 3)**

### Backend Deployment
- Deploy to Railway, Render, or Heroku with PostgreSQL
- Update DATABASE_URL and JWT_SECRET in production
- Set NODE_ENV=production
- Enable HTTPS

### Frontend Deployment
- Build: `npm run build`
- Deploy dist folder to Vercel, Netlify, or GitHub Pages
- Add build command: `npm run build`
- Set VITE_API_URL to production backend URL

---

## **Next Steps**

1. ✅ Backend: Fully implemented with all CRUD operations
2. ✅ Frontend: Integrated with API endpoints
3. ⏳ Phase 2: Add payment integration (Stripe/MoMo)
4. ⏳ Phase 3: Add email notifications
5. ⏳ Phase 4: Deploy to production

---

## **Support**

For issues or questions:
- Check error messages in browser console
- Review backend logs in terminal
- Check database with Prisma Studio: `npm run prisma:studio`
- Verify .env files are correctly configured

Happy coding! 🎉
