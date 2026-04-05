# 🎨 Unigo Backend API

RESTful API for **Mon Nho Handmade** - a handmade products e-commerce platform.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcryptjs for password hashing

## 📁 Project Structure

```
src/backend/
├── src/
│   ├── controllers/       # Route handlers
│   ├── routes/            # API routes
│   ├── middlewares/        # Custom middlewares
│   ├── config/            # Configuration files
│   ├── utils/             # Utility functions
│   └── index.js           # Main server file
├── prisma/
│   └── schema.prisma      # Database schema
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ installed
- PostgreSQL database running
- Git installed

### 1. Install Dependencies

```bash
cd src/backend
npm install
```

### 2. Setup Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/unigo_db?schema=public"
```

### 3. Setup PostgreSQL Database

Make sure PostgreSQL is running and create a new database:

```sql
CREATE DATABASE unigo_db;
```

### 4. Run Prisma Migrations

This command creates the tables in the database:

```bash
npm run prisma:migrate
# or
npm run prisma:generate
```

### 5. Start the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 🧪 Test API Endpoints

Once the server is running, test these endpoints:

### Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "🚀 Server is running!",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### Database Connection Check
```bash
curl http://localhost:5000/api/db-check
```

Expected response:
```json
{
  "success": true,
  "message": "✅ Database connection successful!",
  "database": "PostgreSQL",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

## 📊 Database Schema

### Users Table
```
id          - Primary Key (auto-increment)
email       - Unique email address
password    - Hashed password
name        - User name
role        - ADMIN or CUSTOMER
createdAt   - Timestamp
updatedAt   - Timestamp
```

### Products Table
```
id          - Primary Key (auto-increment)
name        - Product name
description - Product description
price       - Product price
imageUrl    - Product image URL
stock       - Available quantity
category    - Product category
createdAt   - Timestamp
updatedAt   - Timestamp
```

### Orders Table
```
id              - Primary Key (auto-increment)
userId          - Foreign Key (User)
items           - Order items (via OrderItem)
totalAmount     - Total order amount
status          - PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
shippingAddress - Customer shipping address
createdAt       - Timestamp
updatedAt       - Timestamp
```

### Order Items Table
```
id        - Primary Key (auto-increment)
orderId   - Foreign Key (Order)
productId - Foreign Key (Product)
quantity  - Item quantity
price     - Price at time of order
```

## 🔨 Available Scripts

```bash
npm run dev              # Start server with nodemon (development)
npm start               # Start server (production)
npm run prisma:migrate  # Run migrations and apply schema changes
npm run prisma:generate # Generate Prisma client
npm run prisma:reset    # Reset database (WARNING: Deletes all data)
npm run prisma:studio   # Open Prisma Studio (GUI for database)
```

## 📝 Next Steps (Phases)

### ✅ Phase 1: Project Setup & Database Schema (COMPLETED)
- [x] Initialize project structure
- [x] Install dependencies
- [x] Configure environment variables
- [x] Create Prisma schema
- [x] Test database connection

### 🔄 Phase 2: Authentication (TODO)
- [ ] User registration endpoint
- [ ] User login endpoint
- [ ] JWT token generation
- [ ] Protected routes middleware

### 🔄 Phase 3: Products CRUD (TODO)
- [ ] Get all products
- [ ] Get product by ID
- [ ] Create product (Admin only)
- [ ] Update product (Admin only)
- [ ] Delete product (Admin only)

### 🔄 Phase 4: Orders Management (TODO)
- [ ] Create order
- [ ] Get user orders
- [ ] Update order status
- [ ] Delete order

## 🐛 Troubleshooting

### Error: "DATABASE_URL is not defined"
- Make sure `.env` file exists and contains `DATABASE_URL`
- Restart the server after creating `.env`

### Error: "ECONNREFUSED - could not connect to server"
- Verify PostgreSQL is running
- Check DATABASE_URL credentials
- Ensure database exists

### Error: "error: relation "public.users" does not exist"
- Run: `npm run prisma:migrate`
- This creates all tables in the database

## 📚 Useful Resources

- [Express.js Documentation](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [JWT Documentation](https://jwt.io)

---

**Happy Coding! 🚀**
