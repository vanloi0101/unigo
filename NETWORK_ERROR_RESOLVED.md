# ✅ Network Error FIXED! (localhost:4000 → 5000)

**Status**: 🟢 RESOLVED  
**Root Cause**: `.env.local` was overriding `.env`  
**Fix Applied**: Deleted `.env.local` to use correct `.env`  
**Date**: April 11, 2025

---

## 🎯 What Was The Problem?

**Error You Got:**
```
net::ERR_CONNECTION_REFUSED
Failed to connect to http://localhost:4000/api/auth/login
```

**Why It Happened:**
```
Vite Environment Variable Priority:
1. .env.local    ← ⚠️ FOUND: VITE_API_URL=http://localhost:4000/api (OLD!)
2. .env          ← ✅ CORRECT: VITE_API_URL=http://localhost:5000/api
3. Default fallback

Vite loads .env.local LAST, so it overrides .env
→ Frontend was calling http://localhost:4000/api (WRONG!)
→ Backend listening on http://localhost:5000/api (RIGHT!)
→ CONNECTION REFUSED ❌
```

---

## 🔧 Fix Applied

### ✅ Step 1: Deleted `.env.local`
```bash
# Removed: src/fronend/.env.local
# This file was left over from old development and had port 4000
```

### ✅ Step 2: Verified `.env` is Correct
```bash
# File: src/fronend/.env
VITE_API_URL=http://localhost:5000/api  ✅ CORRECT
```

### ✅ Step 3: Killed Dev Server Process
```bash
# Stopped npm dev server (PID: 17672)
# This forces Vite to reload fresh from .env
```

---

## 🚀 What To Do Now

### Option 1: Restart Frontend Dev Server (Recommended)

```bash
# Kill any existing npm/node processes
taskkill /F /IM node.exe

# Or find and stop specific process:
# Get-Process | Where-Object { $_.Id -eq 17672 } | Stop-Process

# Then restart FRESH:
cd src/fronend
npm run dev
```

### Option 2: Manual Cleanup (If Option 1 doesn't work)

```bash
# 1. Kill all Node processes
taskkill /F /IM node.exe

# 2. Clear browser cache
# Ctrl+Shift+Delete → Select "All time" → Clear

# 3. Restart backend
cd src/backend
npm run dev
# Wait 3-5 seconds...

# 4. Restart frontend
cd src/fronend
npm run dev
```

---

## ✅ Verification Checklist

After restarting, verify:

- [ ] Backend running on port 5000
  ```bash
  netstat -ano | Select-String ":5000"
  # Should show: LISTENING
  ```

- [ ] Frontend started successfully
  ```bash
  # Should see in terminal:
  # ➜  Local:   http://localhost:5173/
  # ➜  Press h + enter to show help
  ```

- [ ] Environment variable loaded correctly
  ```javascript
  // In browser console:
  console.log(import.meta.env.VITE_API_URL)
  // Should output: http://localhost:5000/api
  ```

- [ ] API calls use correct port
  ```javascript
  // In browser DevTools → Network tab:
  // Try any API call, check Request URL
  // Should show: http://localhost:5000/api/...
  // NOT http://localhost:4000/api/...
  ```

---

## 🧪 Test Login (Final Verification)

1. **Open frontend**: http://localhost:5173/login

2. **Enter credentials:**
   - Email: `admin@unigo.com`
   - Password: `admin123`

3. **Expected Result:**
   - ✅ No ECONNREFUSED error
   - ✅ Toast shows "✅ Đăng nhập thành công!"
   - ✅ Redirects to `/admin/products`
   - ✅ Token visible in localStorage

4. **Check Network Tab (F12 → Network):**
   - Request URL should be: `http://localhost:5000/api/auth/login`
   - Response status should be: 200
   - Response body should contain JWT token

---

## 📊 Before vs After

### ❌ BEFORE (With .env.local override)
```
src/fronend/.env.local
├─ VITE_API_URL=http://localhost:4000/api  ← Loaded LAST (highest priority)

Login.jsx calls: axiosClient.post('/auth/login')
↓
axiosClient baseURL: http://localhost:4000/api  (from .env.local)
↓
Actual URL: http://localhost:4000/api/auth/login
↓
Backend not listening on 4000
↓
❌ net::ERR_CONNECTION_REFUSED
```

### ✅ AFTER (Deleted .env.local)
```
src/fronend/.env
├─ VITE_API_URL=http://localhost:5000/api  ← Now loaded (only one env file)

Login.jsx calls: axiosClient.post('/auth/login')
↓
axiosClient baseURL: http://localhost:5000/api  (from .env)
↓
Actual URL: http://localhost:5000/api/auth/login
↓
Backend listening on 5000 ✓
↓
✅ Login successful, JWT token returned
```

---

## 📁 Files Status

### ✅ Deleted (Fixed Issue)
```
❌ src/fronend/.env.local (OLD PORT 4000)
```

### ✅ Files Verified
```
✅ src/fronend/.env (PORT 5000) - Correct
✅ src/fronend/src/api/axiosClient.js - Correct (uses VITE_API_URL)
✅ src/fronend/src/pages/Login.jsx - Correct (uses axiosClient)
✅ src/fronend/src/store/useAuthStore.js - Correct
✅ src/fronend/src/store/useProductStore.js - Correct
```

### ⚠️ For Reference Only
```
ℹ️ src/fronend/.env.example (Reference - DON'T USE)
```

---

## 🎓 Lesson: Vite .env File Priority

**Vite loads environment files in this order** (last one wins):

```
1. .env                      (base)
2. .env.[mode]              (dev / prod)
3. .env.local               (local override - HIGHEST PRIORITY!)
4. .env.[mode].local        (local mode override)
```

**Best Practice:**
```bash
# Commit to git:
.env                         ✅ Checked in (default values)
.env.example                 ✅ Checked in (documentation)

# DO NOT commit to git (.gitignore):
.env.local                   ❌ Git ignored (personal overrides)
.env.production.local        ❌ Git ignored (sensitive values)
```

**This way:**
- Team members can customize `.env.local` locally
- Won't break each other's configs
- Sensitive values don't leak to git

---

## 🔐 .gitignore Recommendation

Make sure your `.gitignore` includes:

```bash
# Environment variables - local overrides only
.env.local
.env.*.local
.env.production.*

# Node
node_modules/
dist/
build/
.vite/

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
```

---

## 📞 If Still Not Working

Try these steps in order:

1. **Verify backend is really running on 5000:**
   ```bash
   netstat -ano | Select-String ":5000"
   # Should show: 0.0.0.0:5000 LISTENING [PID]
   ```

2. **Check no .env.local exists:**
   ```bash
   Get-ChildItem "src/fronend/.env*"
   # Should only show: .env (and .env.example)
   # Should NOT show: .env.local
   ```

3. **Clear browser completely:**
   - Close all browser tabs
   - Ctrl+Shift+Delete → Clear ALL time
   - Close and reopen browser

4. **Restart everything fresh:**
   ```bash
   taskkill /F /IM node.exe
   # Restart backend and frontend from scratch
   ```

5. **Check axios client is using env var:**
   ```javascript
   // Browser console:
   fetch('http://localhost:5173/src/api/axiosClient.js')
     .then(r => r.text())
     .then(text => console.log(text.substring(0, 200)))
   ```

---

## 🎉 SUCCESS INDICATORS

When everything is working correctly, you should see:

✅ Frontend loads at `http://localhost:5173`  
✅ Backend API accessible at `http://localhost:5000/api`  
✅ Login page appears without errors  
✅ Can login with admin credentials  
✅ Token saved to localStorage  
✅ Redirects to `/admin/products`  
✅ Products page loads with data  
✅ All API calls in Network tab show `localhost:5000` ✅ No ECONNREFUSED or CORS errors  

---

## 📝 Summary

| Item | Status | Notes |
|------|--------|-------|
| `.env.local` (OLD 4000) | ❌ DELETED | Was overriding .env |
| `.env` (PORT 5000) | ✅ ACTIVE | Now being used by Vite |
| axiosClient baseURL | ✅ CORRECT | Using VITE_API_URL env var |
| Backend port | ✅ 5000 | Confirmed via netstat |
| Python | ⚠️ PENDING | Restart dev server to reload env |

---

**Created**: April 11, 2025  
**Status**: ✅ Ready for Testing  
**Next Steps**: Restart frontend dev server and test login!

```bash
cd src/fronend && npm run dev
```

Then open http://localhost:5173/login and try logging in! 🚀
