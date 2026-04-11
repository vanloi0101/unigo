# 🚀 UNIGO PROJECT STATUS & STARTUP GUIDE (April 5, 2026)

## ✅ Current Status

### Services Running
| Service | Port | Status | PID |
|---------|------|--------|-----|
| **PostgreSQL Database** | 5432 | ✅ Running (Docker) | unigo_postgres |
| **Express Backend** | 5000 | ⚠️ Blocked - Port in use | Multiple processes |
| **Vite Frontend** | 5174 | ✅ Running (5173 was taken) | Node process |

### Database Status
```
✅ Docker Container: unigo_postgres (Up 8 minutes)
✅ Prisma Migrations: Applied (20260405112217_init)
✅ Tables Created: User, Product, Order, OrderItem
```

### Frontend Status
```
✅ Running on: http://localhost:5174
⚠️ Original port 5173 was already in use
✅ CSS Framework: Tailwind
✅ UI Framework: React 18 + Vite 5.4.21
```

### Backend Status
```
❌ Port 5000 BLOCKED - Multiple Node.js processes running
⚠️ Cannot start server - EADDRINUSE error
✅ Code is ready to run (nodemon configured)
✅ Database connection configured (.env ready)
```

---

## 🔧 Current Issues & Solutions

### Issue 1: Port 5000 Blocked
**Problem:** Multiple Node.js processes running, port 5000 already in use  
**Solution:** Kill old processes and restart backend  

```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess

# Kill the process (replace PID with actual process ID)
Stop-Process -Id <PID> -Force

# Clean up all Node processes
Get-Process node | Stop-Process -Force
```

### Issue 2: Port 5173 Already Taken
**Status:** ✅ Solved - Frontend running on port 5174  
**Frontend URL:** http://localhost:5174

---

## 📋 Complete Setup Checklist

### ✅ Completed Steps
- [x] Clone/Navigate to GitHub repository
- [x] Docker PostgreSQL started (`docker-compose up -d`)
- [x] Database migrations applied (`npx prisma migrate deploy`)
- [x] Database tables created (User, Product, Order, OrderItem)
- [x] Frontend started (`npm run dev` on port 5174)
- [x] Environment files configured (.env in backend)

### ⏳ Pending Steps
- [ ] Clear port 5000 (kill blocking processes)
- [ ] Start backend successfully
- [ ] Test API endpoints
- [ ] Update frontend API_URL to match
- [ ] Test full integration

---

## 🎯 Next Immediate Actions

### 1. Kill Blocking Processes (PowerShell as Admin)
```powershell
# Option A: Kill only port 5000 process
$pid = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
if ($pid) { Stop-Process -Id $pid -Force }

# Option B: Kill ALL Node.js processes (aggressive)
Get-Process node | Stop-Process -Force

# Verify:
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
```

### 2. Restart Backend
```powershell
cd "C:\Users\vanlo\all\webapp\unigo\src\backend"
npm run dev
```

### 3. Verify Connection
```powershell
# Test backend
Invoke-WebRequest http://localhost:5000/api/products -Method Get

# Should return: {"success":true,"products":[],...}
```

---

## 🌐 Services URLs (After Fix)

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:5174 | ✅ Ready |
| **Backend API** | http://localhost:5000 | ⏳ Pending (port blocked) |
| **Database** | localhost:5432 | ✅ Ready |
| **Cloudinary** | (demo credentials) | ✅ Configured |

---

## 📊 Project Structure
```
C:\Users\vanlo\all\webapp\unigo\
├── src/
│   ├── backend/           ← Express API (wants port 5000)
│   │   ├── .env           ← Configuration (ready)
│   │   ├── docker-compose.yml
│   │   ├── prisma/
│   │   │   └── migrations/  ← Applied ✅
│   │   └── src/
│   │       ├── index.js    ← Server entry point
│   │       ├── controllers/
│   │       ├── routes/
│   │       └── middlewares/
│   │
│   └── frontend/           ← React + Vite (running on 5174)
│       ├── .env.example
│       └── src/
│           ├── pages/
│           ├── components/
│           └── stores/
│
├── README.md
├── SETUP_GUIDE.md
├── COMPLETE_STATUS.md
└── ADVANCED_SEARCH_GUIDE.md
```

---

## 🔐 Environment Configuration

### Backend (.env - Ready)
```
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/unigo_db"
PORT=5000
NODE_ENV=development
JWT_SECRET="some_secret_key_123"
CORS_ORIGIN=http://localhost:5174
CLOUDINARY_CLOUD_NAME="demo"
CLOUDINARY_API_KEY="demo"
CLOUDINARY_API_SECRET="demo"
```

### Frontend (needs .env)
```
VITE_API_URL=http://localhost:5000
```

---

## 📱 Testing Endpoints (Once Backend Runs)

```bash
# Get all products
curl http://localhost:5000/api/products

# Search products
curl "http://localhost:5000/api/products?search=vòng&category=dihoc"

# With pagination
curl "http://localhost:5000/api/products?page=1&limit=5"

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","firstName":"Test","lastName":"User"}'
```

---

## 🆘 Troubleshooting

### Port Still Blocked After Kill?
```powershell
# Use netstat to find what's using the port
netstat -ano | findstr ":5000"

# Kill by port (Windows)
netsh int ipv4 show tcpstats
```

### Database Connection Error?
```bash
# Test PostgreSQL connection
psql -U postgres -h localhost -p 5432 -d unigo_db

# Or check Docker logs
docker logs unigo_postgres
```

### Frontend can't reach Backend?
- Check CORS_ORIGIN in backend .env
- Check API URL in frontend .env
- Verify both servers running: `netstat -ano | findstr ":5000\|:5174"`

---

## 🎉 Success Checklist

When everything works, you should see:

```
✅ Frontend running: http://localhost:5174
✅ Backend running: http://localhost:5000
✅ Database connected: 4 tables created
✅ Logs show: "Server is running on port 5000"
✅ API response: curl http://localhost:5000/api/products returns JSON
✅ Register works: Create account on login page
✅ Products show: Browse products on home page
```

---

## 📞 Support

If you encounter issues:

1. **Check logs**: Look at terminal output for error messages
2. **Verify ports**: `netstat -ano | findstr "5000\|5174\|5432"`
3. **Reset Docker**: `docker-compose down -v && docker-compose up -d`
4. **Clear cache**: Delete node_modules and reinstall: `npm install`
5. **Restart PC**: Last resort for stubborn port issues

---

**Status:** Ready for backend restart  
**Last Updated:** April 5, 2026  
**Next Step:** Kill blocking processes and restart backend  

Good luck! 🚀
