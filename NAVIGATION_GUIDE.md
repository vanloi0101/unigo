# 🚀 QUICK NAVIGATION GUIDE

## 📍 Current Structure

```
C:\Users\vanlo\all\webapp\unigo\
├── src\
│   ├── backend\      ← Node.js + Express (Port 4000)
│   └── frontend\      ← React + Vite (Port 5174)
├── .git\
├── README.md
└── ... (docs)
```

---

## 🧭 Navigation Commands

### **From Unigo Root → Backend**
```powershell
cd src/backend
# OR full path:
cd C:\Users\vanlo\all\webapp\unigo\src\backend
```

### **From Unigo Root → Frontend**
```powershell
cd src/frontend
# OR full path:
cd C:\Users\vanlo\all\webapp\unigo\src\frontend
```

### **From Backend → Frontend**
```powershell
cd ../frontend
# OR from root:
cd ..
cd src/frontend
```

### **From Frontend → Backend**
```powershell
cd ../backend
# OR from root:
cd ..
cd src/backend
```

### **Any location → Unigo Root**
```powershell
cd C:\Users\vanlo\all\webapp\unigo
```

---

## 🔥 Quick Terminal Setup

### **Option 1: Two Terminal Tabs (RECOMMENDED)**

**Terminal 1 - Backend:**
```powershell
cd C:\Users\vanlo\all\webapp\unigo\src\backend
npm run dev
# Runs on port 4000
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\vanlo\all\webapp\unigo\src\frontend
npm run dev
# Runs on port 5174
```

### **Option 2: One Terminal with Background Process**

```powershell
# Start backend in background
cd C:\Users\vanlo\all\webapp\unigo\src\backend
Start-Process -NoNewWindow npm -ArgumentList "run dev"

# Then start frontend
cd ..\frontend
npm run dev
```

---

## ✅ Check Services Running

### **Check Backend (Port 4000)**
```powershell
netstat -ano | findstr "4000"
```

Expected: Show `LISTENING` on port 4000

### **Check Frontend (Port 5174)**
```powershell
netstat -ano | findstr "5174"
```

Expected: Show `LISTENING` on port 5174

### **Check All Node Processes**
```powershell
Get-Process node
```

Expected: Show 2 node.exe processes (backend + frontend)

---

## 📋 Common Commands

| Task | Command | Location |
|------|---------|----------|
| **Start Backend** | `npm run dev` | `src/backend` |
| **Start Frontend** | `npm run dev` | `src/frontend` |
| **Install Depends** | `npm install` | `src/backend` or `src/frontend` |
| **Build Frontend** | `npm run build` | `src/frontend` |
| **Kill All Node** | `taskkill /F /IM node.exe` | Any |
| **Create Admin** | `node create-admin.js` | `src/backend` |

---

## 🌐 Access URLs

```
Frontend:   http://localhost:5174
Login:      http://localhost:5174/login
Admin:      http://localhost:5174/admin
API:        http://localhost:4000/api
Health:     http://localhost:4000/api/health
```

---

## 💡 Pro Tips

1. **Use Tab completion:** Type `cd src/b` + Tab → auto-complete to `src/backend`
2. **Use Up Arrow:** Recall previous commands
3. **Open in VS Code:** `code .` (from unigo root)
4. **Dark mode:** Right-click PowerShell title → Properties → Colors

---

## 🔴 Troubleshooting Navigation

| Error | Solution |
|-------|----------|
| `ItemNotFoundException` | Wrong path. Check current location with `pwd` |
| `Path too long` | Use relative paths like `cd ../backend` |
| `Cannot find npm` | Make sure you're in right folder with `package.json` |
| `Port already in use` | Kill process: `taskkill /F /IM node.exe` |

---

