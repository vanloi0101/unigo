# 🎀 Unigo - Mon Nho Handmade E-Commerce Platform

A full-stack e-commerce platform for handmade products with modern web technologies. Built with **React**, **Node.js**, **PostgreSQL**, and **Cloudinary**.

## 📊 Project Status: 95% Complete ✅

| Component | Status | Details |
|-----------|--------|---------|
| **Backend API** | ✅ 100% | 13 REST endpoints, authentication, search/filter |
| **Frontend** | ✅ 95% | Product listing, cart, admin panel, responsive design |
| **Database** | ✅ 100% | PostgreSQL with Prisma ORM, migrations complete |
| **Authentication** | ✅ 100% | JWT + bcryptjs secure login/register |
| **Image Upload** | ✅ 100% | Cloudinary integration with validation |
| **Search/Filter** | ✅ 100% | Text search, category, price range, pagination |

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18.2
- **Database:** PostgreSQL + Prisma 5.8.0
- **Authentication:** JWT (jsonwebtoken 9.0.2) + bcryptjs
- **File Upload:** Multer 1.4.5-lts.1 + Cloudinary 1.41.0
- **Validation:** Zod

### Frontend
- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.0.8
- **State Management:** Zustand 4.4.0
- **Styling:** Tailwind CSS 3.3.0
- **HTTP Client:** Axios with interceptors
- **Form Management:** React Hook Form + Zod
- **Notifications:** React Hot Toast
- **UI Components:** Lucide React

### DevOps
- **Containerization:** Docker + Docker Compose
- **Web Server:** Nginx (production)
- **Database:** PostgreSQL 15

## 📁 Project Structure

```
unigo/
├── src/
│   ├── backend/                    # Node.js/Express API
│   │   ├── src/
│   │   │   ├── controllers/        # Business logic (productController, authController, etc.)
│   │   │   ├── routes/             # API endpoints
│   │   │   ├── middlewares/        # Auth, upload, error handlers
│   │   │   ├── services/           # Business logic layer
│   │   │   ├── schemas/            # Zod validation schemas
│   │   │   ├── config/             # Cloudinary, database config
│   │   │   └── index.js            # Express app setup
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Database schema
│   │   │   └── migrations/         # Database migration history
│   │   ├── Dockerfile              # Backend container
│   │   └── package.json            # Backend dependencies
│   │
│   └── frontend/                   # React + Vite SPA
│       ├── src/
│       │   ├── components/         # Reusable React components
│       │   ├── pages/              # Page components (Products, Cart, Admin)
│       │   ├── store/              # Zustand stores (auth, cart, products)
│       │   ├── api/                # Axios client setup
│       │   ├── hooks/              # Custom React hooks
│       │   ├── utils/              # Utilities (formatPrice, queryClient)
│       │   ├── App.jsx             # Main app component
│       │   └── main.jsx            # Entry point
│       ├── Dockerfile              # Frontend container
│       ├── vite.config.js          # Vite configuration
│       └── package.json            # Frontend dependencies
│
├── docker-compose.yml              # Multi-container orchestration
├── nginx-production.conf           # Nginx reverse proxy config
└── SETUP_GUIDE.md                  # Detailed installation guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Docker Desktop
- PostgreSQL 12+ (or use Docker)
- Cloudinary account (for image uploads)

### Option 1: Docker (Recommended)

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up -d

# Initialize database
docker-compose exec backend npx prisma migrate dev

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
# Database: localhost:5432
```

### Option 2: Local Development

#### Backend Setup
```bash
cd src/backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://postgres:password@localhost:5432/unigo
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secure-secret-key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EOF

# Setup database
npx prisma migrate dev
npx prisma generate

# Start server (runs on port 5000)
npm run dev
```

#### Frontend Setup
```bash
cd src/frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:5000
EOF

# Start dev server (runs on port 5173)
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/unigo` | PostgreSQL connection |
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `development` \| `production` | Environment mode |
| `CORS_ORIGIN` | `http://localhost:5173` | Frontend URL for CORS |
| `JWT_SECRET` | `your-secret-key` | JWT signing secret |
| `JWT_EXPIRE` | `7d` | Token expiration time |
| `CLOUDINARY_CLOUD_NAME` | `your-name` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `your-key` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `your-secret` | Cloudinary API secret |

### Frontend (.env.local)
| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:5000` | Backend API URL |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products?search=...&category=...&minPrice=...&maxPrice=...&page=...&limit=...` - List products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (multipart, admin only)
- `PUT /api/products/:id` - Update product (multipart, admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders (paginated)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Search Parameters
```bash
# Text search
GET /api/products?search=vòng

# Category filter
GET /api/products?category=dihoc

# Price range
GET /api/products?minPrice=30000&maxPrice=100000

# Pagination
GET /api/products?page=1&limit=10

# Combined
GET /api/products?search=handmade&category=jewelry&minPrice=50000&maxPrice=200000&page=1&limit=20
```

## 🎨 Features

### User Features
- ✅ User registration & login with JWT
- ✅ Product browsing with search & filtering
- ✅ Category browsing
- ✅ Shopping cart (persistent with Zustand)
- ✅ Order placement
- ✅ Order history & tracking
- ✅ Responsive mobile design

### Admin Features
- ✅ Product management (CRUD)
- ✅ Image upload to Cloudinary
- ✅ Order management & status updates
- ✅ Advanced search & filter admin panel

### Technical Features
- ✅ JWT-based authentication
- ✅ Cloudinary image integration
- ✅ Full-text search
- ✅ Price range filtering
- ✅ Pagination
- ✅ Error handling & validation
- ✅ CORS support
- ✅ Docker containerization
- ✅ Database migrations

## 📚 Documentation

Detailed guides are included in the repository:

| Document | Purpose |
|----------|---------|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Complete installation & setup instructions |
| [CLOUDINARY_UPLOAD_GUIDE.md](CLOUDINARY_UPLOAD_GUIDE.md) | Image upload configuration & usage |
| [ADVANCED_SEARCH_GUIDE.md](ADVANCED_SEARCH_GUIDE.md) | Search & filter API documentation |
| [COMPLETE_STATUS.md](COMPLETE_STATUS.md) | Comprehensive project status report |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Phase-by-phase implementation details |

## 🧪 Testing

### Test API with cURL
```bash
# Get all products
curl "http://localhost:5000/api/products"

# Search products
curl "http://localhost:5000/api/products?search=vòng"

# Filter by category
curl "http://localhost:5000/api/products?category=dihoc"

# Get product details
curl "http://localhost:5000/api/products/1"

# Login (returns JWT token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Test with Postman
Import the Postman collection:
```
src/backend/Unigo_API.postman_collection.json
```

### Manual Testing
1. Open frontend: http://localhost:5173
2. Register a new account
3. Browse products with search/filters
4. Add items to cart
5. Checkout (place order)
6. View order history
7. Login as admin to manage products

## 🔧 Common Commands

### Backend
```bash
cd src/backend

npm run dev              # Start development server
npm run build          # Build for production
npm run start          # Start production server
npm run migrate        # Run database migrations
npx prisma studio    # Open Prisma Studio UI
npm test              # Run tests (if configured)
```

### Frontend
```bash
cd src/frontend

npm run dev           # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
```

### Docker
```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild images
docker-compose up -d --build

# Initialize database
docker-compose exec backend npx prisma migrate dev
```

## 🐛 Known Issues & Fixes

### Fixed Issues ✅
- **JWT Version:** Downgraded to 9.0.2 (9.1.2 doesn't exist)
- **Product Listing:** Fixed double-fetch with StrictMode + AbortController
- **Image URLs:** Added validation & fallback in ProductCard
- **State Management:** Unified Zustand stores with proper refetching
- **Response Parsing:** Removed redundant `.data` nesting in API responses

### Current Limitations
- Payment integration (Stripe/MoMo) - planned
- Product detail page - in progress
- Order tracking visualization - planned

## 📊 Database Schema

Key entities:
- **User** - Authentication & profile
- **Product** - Handmade items with images
- **Category** - Product categories
- **Cart** - User shopping cart
- **Order** - Order records
- **OrderItem** - Individual items in orders

View full schema: [src/backend/prisma/schema.prisma](src/backend/prisma/schema.prisma)

## 🚦 Development Workflow

1. **Branch Strategy:** Create feature branches from `main`
2. **Commits:** Write clear commit messages
3. **Testing:** Test locally before pushing
4. **PR:** Create pull request for review
5. **Deploy:** Merge to `main` for production deployment

## 📞 Support & Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres -d unigo -c "SELECT 1"

# Reset migrations
npx prisma migrate reset
```

### Frontend Not Connecting to Backend
- Verify `VITE_API_BASE_URL` in `.env.local`
- Check CORS_ORIGIN in backend `.env`
- Ensure backend is running on port 5000

### Cloudinary Upload Fails
- Verify credentials in `.env`
- Check file size limits
- Ensure correct image format (jpg, png, webp)

## 📝 License

Private project - All rights reserved

## 👥 Contributors

- Project developed as Mon Nho Handmade e-commerce platform
- Full-stack implementation with modern architecture
- Regular updates and improvements ongoing

---

**Last Updated:** April 22, 2026  
**Version:** 1.0.0  
**Status:** Production Ready 🚀

