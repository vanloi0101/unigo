# 🐳 Docker Compose Port 5432 Conflict - Fix Guide

## 🐛 Problem

```
Bind for 0.0.0.0:5432 failed: port is already allocated
```

PostgreSQL port 5432 is already in use by another container or service.

---

## ✅ Solution 1: Stop All Docker Containers (Recommended)

### Windows (PowerShell/CMD):

```powershell
# Stop all running containers
docker stop $(docker ps -q)

# Remove all stopped containers (optional cleanup)
docker rm $(docker ps -a -q)

# Remove untagged image dangling images (optional cleanup)
docker rmi $(docker images -q -f "dangling=true")
```

### Then Start Docker Compose:
```powershell
cd C:\Users\vanlo\all\webapp\unigo
docker-compose up --build
```

---

## ✅ Solution 2: Change Port in docker-compose.yml (If you need multiple PostgreSQL instances)

### File: `docker-compose.yml`

**Before:**
```yaml
db:
  image: postgres:15-alpine
  ports:
    - "5432:5432"  # ❌ Already in use
```

**After:**
```yaml
db:
  image: postgres:15-alpine
  ports:
    - "5433:5432"  # ✅ Changed host port from 5432 to 5433
```

This maps:
- **Host port 5433** → Container port 5432
- No changes needed in backend `.env` (it uses internal Docker network)

### Update Backend Connection (if using external connection):

If your backend `.env` has `DATABASE_URL` pointing to `localhost:5432`:

```env
# BEFORE
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# AFTER
DATABASE_URL=postgresql://localhost:5433/db  # Match new host port
```

---

## ✅ Solution 3: Use Named Volumes & Fresh Container

```powershell
# Clean start - remove old containers and volumes
docker-compose down -v

# Rebuild and start fresh
docker-compose up --build
```

---

## 🔍 Check Current Status

### List Running Containers:
```powershell
docker ps
```

### List All Containers (including stopped):
```powershell
docker ps -a
```

### Check Port Usage:
```powershell
netstat -ano | findstr :5432
```

### View Docker Logs:
```powershell
docker-compose logs db
```

---

## 📋 Quick Commands

| Task | Command |
|------|---------|
| Stop all containers | `docker stop $(docker ps -q)` |
| Remove all containers | `docker rm $(docker ps -a -q)` |
| Clean up volumes | `docker volume prune` |
| Full reset | `docker-compose down -v` |
| Start fresh | `docker-compose up --build` |
| View specific logs | `docker-compose logs db` |
| Restart service | `docker-compose restart db` |

---

## 🎯 Recommended Steps (Quick Fix)

1. **Stop all Docker containers:**
   ```powershell
   docker stop $(docker ps -q)
   ```

2. **Clean up volumes (optional):**
   ```powershell
   docker-compose down -v
   ```

3. **Start docker-compose fresh:**
   ```powershell
   cd C:\Users\vanlo\all\webapp\unigo
   docker-compose up --build
   ```

4. **Verify it's working:**
   ```
   ✅ Should see:
   - db service creating...
   - backend service creating...
   - frontend service creating...
   ```

---

## ⚠️ If Still Failing

Check for conflicting PostgreSQL:

```powershell
# Windows - find process using 5432
netstat -ano | findstr :5432

# Kill the process (if it's not Docker)
taskkill /PID <PID> /F

# Or disable PostgreSQL service if installed locally:
net stop postgresql-x64-...
```

---

**Status**: Ready to fix | **Effort**: < 2 minutes
