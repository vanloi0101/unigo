# 🔧 EADDRINUSE Port Conflict Resolution Guide

## 📍 Current Port Configuration

| Service | Port | File | Env Variable |
|---------|------|------|--------------|
| **Backend (Node.js)** | `3000` | `src/backend/.env` | `PORT=3000` |
| **Frontend Dev** | `5173` (Vite default) | `src/frontend/vite.config.js` | - |
| **Docker Frontend** | `8080` | `docker-compose.yml` | - |
| **Docker Backend** | `3000` | `docker-compose.yml` | `PORT=3000` |

---

## 🚨 What is EADDRINUSE Error?

```
Error: listen EADDRINUSE: address already in use :::3000
```

This means **another process** is already using port 3000 (or whichever port), so your Node.js server cannot start.

---

## ✅ Fix 1: Kill Process Using Port (Quick Fix)

### Option A: Kill by Port Number (Windows)

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Example output:
# TCP    0.0.0.0:3000      0.0.0.0:0      LISTENING    5432

# Kill the process (PID = 5432)
taskkill /PID 5432 /F

# For multiple ports:
taskkill /F /IM node.exe  # Kill ALL Node processes
```

### Option B: Kill by Port on macOS/Linux

```bash
lsof -i :3000
kill -9 <PID>
```

---

## ✅ Fix 2: Change Port Number (Recommended for parallel development)

### 2.1 Backend - Change Port 3000 → 3001

**File: `src/backend/.env`**
```env
# BEFORE
PORT=3000

# AFTER
PORT=3001
```

**File: `docker-compose.yml`**
```yaml
# BEFORE
backend:
  ports:
    - "3000:3000"

# AFTER
backend:
  ports:
    - "3001:3000"  # Host:Container (3001 for host, 3000 inside container)
```

### 2.2 Frontend - Change Port 5173 → 5174

**File: `src/frontend/vite.config.js`**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,  // Changed from 5173
    host: '0.0.0.0',
    open: true
  }
})
```

### 2.3 Update Frontend .env

**File: `src/frontend/.env`**
```env
# BEFORE
VITE_API_URL=http://localhost:3000/api

# AFTER
VITE_API_URL=http://localhost:3001/api  # Match backend port change
```

---

## ✅ Fix 3: Check What's Using Each Port

### Windows - Detailed Check

```powershell
# Check port 3000
netstat -ano | findstr :3000

# Check port 5173
netstat -ano | findstr :5173

# Get process name
tasklist | findstr <PID>

# Kill specific processes
taskkill /PID <PID> /F
taskkill /F /IM node.exe
taskkill /F /IM npm.exe
```

### Multi-Port Check Script

```powershell
Write-Host "=== Port Status Check ===" -ForegroundColor Cyan
$ports = @(3000, 3001, 5173, 5174, 8080)

foreach ($port in $ports) {
    $result = netstat -ano | findstr ":$port"
    if ($result) {
        Write-Host "Port $port - IN USE" -ForegroundColor Red
        Write-Host $result
    } else {
        Write-Host "Port $port - FREE" -ForegroundColor Green
    }
}
```

---

## ✅ Fix 4: Complete Cleanup & Fresh Start

### Step 1: Kill All Node Processes
```powershell
taskkill /F /IM node.exe
taskkill /F /IM npm.exe
```

### Step 2: Clear npm Cache
```powershell
cd src/backend
npm cache clean --force
rm -r node_modules
npm install

cd ../frontend
npm cache clean --force
rm -r node_modules
npm install
```

### Step 3: Verify Ports are Free
```powershell
netstat -ano | findstr ":3000"
netstat -ano | findstr ":5173"
```

### Step 4: Start Services

**Terminal 1 - Backend:**
```powershell
cd src/backend
npm run dev  # or node src/index.js
```

**Terminal 2 - Frontend:**
```powershell
cd src/frontend
npm run dev
```

---

## 🐳 Fix 5: Using Docker Compose

If you want to use Docker, ensure ports are not already in use:

```powershell
# Check Docker ports
netstat -ano | findstr ":3000"
netstat -ano | findstr ":8080"

# Start Docker Compose
docker-compose up --build
```

---

## 📋 Troubleshooting Checklist

- [ ] Kill all Node processes: `taskkill /F /IM node.exe`
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Delete `node_modules` and reinstall
- [ ] Check ports with: `netstat -ano | findstr ":3000"`
- [ ] Verify `.env` files have correct port numbers
- [ ] Restart terminal (PowerShell/CMD)
- [ ] Restart computer if issues persist
- [ ] Check Windows Firewall isn't blocking ports

---

## 🔍 Common Causes

| Issue | Solution |
|-------|----------|
| Previous npm process didn't terminate | `taskkill /F /IM node.exe` |
| Multiple terminals running same port | Change port in `.env` or kill processes |
| Firewall blocking port | Check Windows Firewall settings |
| WAIT_ON timeout in scripts | Increase timeout or check port is open |
| Docker port mapping conflict | Change host port in `docker-compose.yml` |

---

## ✅ Recommended Port Configuration for Development

```
Backend:    http://localhost:3000/api  (production)
            http://localhost:3001/api  (alternative if conflict)

Frontend:   http://localhost:5173      (default Vite)
            http://localhost:5174      (alternative if conflict)

Docker:     http://localhost:8080      (Nginx)
```

---

## 📝 Quick Reference Commands

```powershell
# Kill all Node processes
taskkill /F /IM node.exe

# Check port 3000
netstat -ano | findstr :3000

# Find PID and kill
$result = netstat -ano | findstr :3000
$pid = $result -split '\s+' | Select-Object -Last 1
taskkill /PID $pid /F

# Clean install dependencies
rm -r node_modules
npm install

# Start backend
node src/index.js

# Start frontend
npm run dev
```

---

Generated: 2026-04-11
Last Updated: 2026-04-11
