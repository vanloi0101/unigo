# 🔧 Network Error Fix Guide (localhost:4000 vs 5000)

**Status**: Configuration is ✅ CORRECT, but dev server needs reload  
**Issue**: `net::ERR_CONNECTION_REFUSED` when calling `http://localhost:4000/api/auth/login`  
**Root Cause**: Vite cache or old dev server instance still running

---

## 🎯 Quick Fix (Do This First!)

### Step 1: Stop everything
```bash
# Kill all Node processes
# Windows PowerShell:
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# Or manually: Close all vs code terminals
```

### Step 2: Clear browser cache
```
Ctrl + Shift + Delete  (or Cmd + Shift + Delete on Mac)
→ Select "All time"
→ Check "Cookies & other site data" + "Cached images & files"
→ Click "Clear data"
```

### Step 3: Clear node_modules & reinstall
```bash
cd src/fronend

# Remove node_modules & lock files
rm -r node_modules
rm package-lock.json

# Reinstall
npm install
```

### Step 4: Restart dev servers in correct order
```bash
# Terminal 1: Backend (MUST be port 5000)
cd src/backend
npm run dev

# Wait 3-5 seconds for backend to start...

# Terminal 2: Frontend (MUST be port 5173)
cd src/fronend
npm run dev

# Wait for Vite to start and show:
# ➜  Local:   http://localhost:5173/
```

---

## ✅ Verification Checklist

### Check 1: Backend Running?
```bash
# In terminal or PowerShell:
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "🚀 Server is running!",
  "timestamp": "2025-04-11T..."
}
```

### Check 2: Vite Loading .env Correctly?
Open browser DevTools (F12) → Console → Type:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

**Expected output**: `http://localhost:5000/api`  
**If shows undefined**: Vite didn't reload env, restart dev server

### Check 3: axiosClient Using Correct URL?
In browser console:
```javascript
// First import the module
import('http://localhost:5173/src/api/axiosClient.js?t=' + Date.now())
  .then(m => console.log(m.default.defaults.baseURL))
```

**Expected**: `http://localhost:5000/api`

### Check 4: Network Tab Verification
1. Open DevTools → Network tab
2. Try to login
3. Look for request to `auth/login`
4. Check Request URL column:
   - ❌ **WRONG**: `http://localhost:4000/api/auth/login`
   - ✅ **CORRECT**: `http://localhost:5000/api/auth/login`

---

## 📋 File Configuration Review

### Current Configuration Status

**✅ File: src/fronend/.env**
```
VITE_API_URL=http://localhost:5000/api
```
Status: ✅ CORRECT

**✅ File: src/fronend/src/api/axiosClient.js**
```javascript
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  // ...
});
```
Status: ✅ CORRECT (reads from .env, falls back to 5000)

**✅ File: src/fronend/src/pages/Login.jsx**
```javascript
const response = await axiosClient.post('/auth/login', {
  email: data.email,
  password: data.password,
});
```
Status: ✅ CORRECT (uses axiosClient instance)

**✅ File: src/fronend/src/api/apiServices.js**
```javascript
login: (email, password) =>
  axiosClient.post('/auth/login', { email, password }),
```
Status: ✅ CORRECT (uses axiosClient)

---

## 🚨 Diagnostic Script

Run this in browser console to diagnose issues:

```javascript
// Diagnostic check script
(async function diagnose() {
  console.log('🔍 Diagnosing Frontend-Backend Connection...\n');
  
  // 1. Check .env variable
  console.log('1️⃣ VITE_API_URL:', import.meta.env.VITE_API_URL);
  
  // 2. Check axiosClient baseURL
  try {
    const response = await fetch('/src/api/axiosClient.js?t=' + Date.now());
    console.log('2️⃣ axiosClient.js loaded');
  } catch (e) {
    console.log('2️⃣ Error loading axiosClient.js:', e.message);
  }
  
  // 3. Check if backend accessible
  try {
    const backendTest = await fetch('http://localhost:5000/api/health');
    const data = await backendTest.json();
    console.log('3️⃣ Backend (5000) Status:', data.message);
  } catch (e) {
    console.log('3️⃣ Backend (5000) Error:', e.message);
  }
  
  // 4. Check localStorage
  console.log('4️⃣ localStorage token:', localStorage.getItem('token') ? '✅ Present' : '❌ Empty');
  
  console.log('\n✅ Diagnostic complete');
})();
```

---

## 🛠️ Advanced Troubleshooting

### Issue: Still showing localhost:4000?

**Scenario A: Old .env.local or build**
```bash
# Check for multiple env files
ls src/fronend/.env*

# If .env.local exists and has old URL:
cat src/fronend/.env.local
# Delete if wrong:
rm src/fronend/.env.local
```

**Scenario B: Vite cache**
```bash
cd src/fronend
rm -rf .vite
npm run dev
```

**Scenario C: Built version is old**
```bash
cd src/fronend
rm -rf dist
npm run dev  # Fresh dev server
```

### Issue: Backend not responding on 5000

```bash
# Check what's running on port 5000
# Windows:
netstat -ano | findstr :5000

# If something else is using 5000:
# Kill it or tell backend to use different port
```

### Issue: CORS error instead of connection refused

Backend needs CORS setup. Check `src/backend/src/index.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
```

---

## 📊 Expected Behavior After Fix

### ✅ Correct Flow
```
1. Vite dev server loads (http://localhost:5173/)
2. .env is loaded with VITE_API_URL=http://localhost:5000/api
3. axiosClient.js creates axios instance with baseURL=5000
4. User fills login form
5. Login.jsx calls axiosClient.post('/auth/login', ...)
6. Actual URL is: http://localhost:5000/api/auth/login ✅
7. Backend responds with JWT token
8. Token saved to localStorage
9. Redirect to /admin
```

### ❌ Wrong Flow (Your Current Issue)
```
1. Vite dev server has cached old URL
2. axiosClient somehow references old baseURL
3. API call goes to http://localhost:4000/api/auth/login ❌
4. ECONNREFUSED (no backend on 4000)
5. Login fails
```

---

## 🔄 Complete Cleanup Procedure

If above steps don't work, do full nuclear reset:

```bash
# 1. Kill all Node processes
taskkill /F /IM node.exe  # Windows

# 2. Clean frontend
cd src/fronend
rm -rf node_modules package-lock.json .vite dist

# 3. Reinstall
npm install

# 4. Verify .env exists and correct
cat .env

# Expected output:
# VITE_API_URL=http://localhost:5000/api

# 5. Restart both servers fresh
# Terminal 1:
cd src/backend && npm run dev

# Wait 5 seconds...

# Terminal 2:
cd src/fronend && npm run dev
```

---

## 📝 Manual Verification Steps

### Step 1: Confirm .env Content
```bash
cat src/fronend/.env | grep VITE_API_URL
```
Should output: `VITE_API_URL=http://localhost:5000/api`

### Step 2: Check axiosClient.js
```bash
grep -A 2 "baseURL:" src/fronend/src/api/axiosClient.js
```
Should show:
```
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
```

### Step 3: Confirm No Hardcoded 4000
```bash
grep -r "4000" src/fronend/src/
```
Should return: **Nothing** (no matches)

### Step 4: Check Backend Port
```bash
grep -r "5000\|PORT" src/backend/.env | head -5
```
Should show backend listening on 5000

---

## 🎯 Final Check

After doing the cleanup:

1. **Try logging in**:
   - Go to http://localhost:5173/login
   - Try credentials: admin@unigo.com / admin123

2. **Check Network tab** (F12 → Network):
   - Should see request to `http://localhost:5000/api/auth/login`
   - Should get response with status 200 + JWT token

3. **Check localStorage** (F12 → Application → Local Storage):
   - Should see: `token` (JWT string)
   - Should see: `user` (JSON with user data)

4. **Should redirect** to `/admin/products` page

---

## ⚡ If Still Not Working

Check these in order:

| Check | Command | Expected |
|-------|---------|----------|
| Backend running? | `curl http://localhost:5000/api/health` | JSON response ✅ |
| Frontend port? | Open http://localhost:5173 | Page loads ✅ |
| Env loaded? | `console.log(import.meta.env.VITE_API_URL)` | 5000/api ✅ |
| Network request? | F12 Network tab | URL shows 5000 ✅ |
| DB seeded? | `curl http://localhost:5000/api/auth/login` (POST with creds) | User exists ✅ |

---

## 🔐 Environment Variable Best Practices

**Why use .env instead of hardcode?**
- ✅ Easy to switch between localhost, staging, production
- ✅ Doesn't expose sensitive URLs in git
- ✅ Different team members can have different .env
- ✅ CI/CD can inject environment-specific values

**Vite .env loading rules:**
```
.env                   # Loaded always
.env.local             # Loaded always (in git ignore) ✅
.env.[mode]            # Loaded by mode (dev, prod)
.env.[mode].local      # Loaded by mode + local override
```

**To use in code:**
```javascript
// Must start with VITE_ prefix
import.meta.env.VITE_API_URL   // ✅ Works
import.meta.env.API_URL        // ❌ Ignored by Vite
process.env.VITE_API_URL       // ❌ Undefined in Vite
```

---

## 📞 Final Verification

After implementing fixes, run this command sequence:

```bash
# Terminal 1: Start Backend
cd src/backend && npm run dev
# Should see: Server running on port 5000

# Terminal 2: Start Frontend (wait 3 seconds)
cd src/fronend && npm run dev
# Should see: ➜  Local: http://localhost:5173/

# Terminal 3: Test API
curl http://localhost:5000/api/health
# Should see: {"success":true,"message":"🚀 Server is running!"...}
```

---

**Created**: April 11, 2025  
**Status**: Configuration ✅ Correct | Needs Vite Reload  
**Next**: Follow cleanup steps above, then test login  

If still failing after all steps → Check backend is actually running on 5000 (not just saying it is)
