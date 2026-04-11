# 🎨 HƯỚNG DẪN GIAO DIỆN LOGIN & ADMIN MỚI

**Ngày cập nhật:** April 5, 2026

---

## 🎯 Thay Đổi Giao Diện

### 1️⃣ **Trang Login (Đẹp & Hiện Đại)**

#### **Design Features:**
- ✨ **Gradient Background** - Màu tím & hồng theo theme
- 🎨 **Animated Blobs** - Hiệu ứng nền động
- 💎 **Logo Icon** - Icon Gem với animation bounce
- 📱 **Responsive Design** - Đẹp trên mobile & desktop
- 🔐 **Modern Input** - Border 2px, bg gradient, focus ring
- 🎪 **Demo Credentials** - Hiển thị tài khoản để test
- ⬅️ **Back to Home** - Link quay về trang chủ
- 🔔 **Toast Notifications** - Thông báo đăng nhập

#### **URL:** `http://localhost:5174/login`

#### **Tài Khoản Test Sẵn:**
```
Email: admin@unigo.com
Password: admin123
```

---

### 2️⃣ **Header (Cập Nhật Auth)**

#### **Thay Đổi:**
```
BỀN TRƯỚC:
├─ Logo
├─ Navigation (Trang chủ, Về Mận, Sản phẩm)
└─ Nút Tư vấn Zalo

BỀN NGOÀI:
├─ Logo
├─ Navigation
├─ [Nếu chưa login] Nút Đăng Nhập + Tư vấn Zalo
├─ [Nếu login rồi] Avatar + Đăng Xuất
└─ Menu Mobile (responsive)
```

#### **Nút Đăng Nhập Desktop:**
- Border tím + text tím
- Hover: bg tím + text trắng
- Icon đăng nhập

#### **Nút Đăng Xuất:**
- Nền đỏ nhạt + text đỏ
- Icon key (🔑)

---

### 3️⃣ **Hero Section (Trang Chủ)**

#### **Thay Đổi:**
```
BỌC NÚT:
├─ Xem Bộ Sưu Tập
├─ Câu chuyện của Mận
└─ [MỚI] Đăng Nhập Admin / Vào Admin

LOGIC:
├─ Nếu chưa login: "Đăng Nhập Admin" (gradient purple→pink)
└─ Nếu login rồi: "Vào Admin" (gradient purple→pink)
```

#### **Style Nút Admin:**
- Gradient: Tím → Hồng
- Icon key (🔑)
- Hover: scale + shadow
- Active: scale nhỏ

---

## 🚀 Các Files Được Cập Nhật

### **1. Login.jsx** ✅
```javascript
// Cập nhật:
- Import Link, FaEnvelope, FaLock, FaSignInAlt
- Thêm defaultValues (demo credentials)
- Redesign UI với Tailwind gradient
- Thêm back link, demo panel
- Responsive mobile menu
```

**File:** `src/frontend/src/pages/Login.jsx`

### **2. Header.jsx** ✅
```javascript
// Cập nhật:
- Import Link, useNavigate, FaUser, FaSignOutAlt
- Thêm useAuthStore hook
- Conditional render: Login / Logout
- Mobile menu mở/đóng
- Show user name khi login
```

**File:** `src/frontend/src/components/Header.jsx`

### **3. Hero.jsx** ✅
```javascript
// Cập nhật:
- Import Link, FaKey, useAuthStore
- Thêm nút conditionally:
  - Nếu login: "Vào Admin"
  - Nếu chưa: "Đăng Nhập Admin"
- Gradient button style
```

**File:** `src/frontend/src/components/Hero.jsx`

---

## 📱 Quy Trình Đăng Nhập Người Dùng

```
┌──────────────────────────────────────┐
│     User vào trang chủ               │
│  http://localhost:5174               │
└──────────┬───────────────────────────┘
           │
           ├─ [Chưa login] → Thấy nút "Đăng Nhập Admin" (Hero + Header)
           │
           └─ [Login rồi] → Thấy nút "Vào Admin" (Hero)
                            + Avatar + Đăng Xuất (Header)

           ▼
┌──────────────────────────────────────┐
│   Click "Đăng Nhập Admin"             │
│   ↓ Redirect tới /login              │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│   Login Page (Trang đẹp mới)         │
│   - Gradient bg                      │
│   - Form validate                    │
│   - Demo credentials                 │
│   - Back to home link                │
└──────────┬───────────────────────────┘
           │
           ├─ Nhập email + password
           │
           ▼
┌──────────────────────────────────────┐
│   Nhấn "Đăng Nhập Admin"              │
│   → API: POST /auth/login             │
└──────────┬───────────────────────────┘
           │
           ├─ ✅ Login thành công
           │   → Token lưu localStorage
           │   → User lưu localStorage
           │   → Redirect tới /admin
           │   → Toast: "✅ Đăng nhập thành công!"
           │
           └─ ❌ Login fail
               → Toast: lỗi từ API
               → Stay trên /login
```

---

## 🎨 Color Scheme

### **Theme Colors (Tailwind):**
```
Primary:      brand-purple    (#8B5CF6)
Secondary:    brand-pink      (#D946A6)
Dark:         brand-dark      (#2C1E4E)
```

### **Login Page Colors:**
```
BG:           Gradient purple50 → white → pink50
Form:         White + backdrop blur
Border:       Gray-200 (unfocus) → brand-purple (focus)
Error:        Red-400 + Red-50 bg
Button:       Gradient purple → pink
Button Hover: Scale 1.05 + shadow
```

---

## 🔐 Authentication Flow

### **Step 1: Check Auth State**
```javascript
// Header & Hero check: isAuthenticated
import useAuthStore from '../store/useAuthStore';
const { isAuthenticated, user } = useAuthStore();

// Show different buttons based on auth state
{isAuthenticated ? <AdminButton /> : <LoginButton />}
```

### **Step 2: Login API Call**
```javascript
// axiosClient.post() automatically:
// - Adds Authorization header with token
// - Handles 401/403 errors
// - Refreshes token if needed

const response = await axiosClient.post('/auth/login', {
  email: data.email,
  password: data.password
});
```

### **Step 3: Store Token & User**
```javascript
// useAuthStore.login() action
login(response.data.user, response.data.token);

// Stores:
// - localStorage.setItem('token', token)
// - localStorage.setItem('user', JSON.stringify(user))
```

### **Step 4: Redirect to Admin**
```javascript
// Navigate to admin page
navigate('/admin', { replace: true });

// ProtectedRoute checks token + redirects if needed
```

---

## 📸 Visual Changes

### **BEFORE vs AFTER**

**Header:**
```
BEFORE:
┌─────────────────────────────────┐
│ Logo  |  Nav  |  [Tư vấn Zalo] │
└─────────────────────────────────┘

AFTER:
┌──────────────────────────────────────┐
│ Logo  |  Nav  |  [Đăng Nhập] [Zalo] │  (Not logged in)
│ Logo  |  Nav  |  [Admin] [Đăng Xuất]│  (Logged in)
└──────────────────────────────────────┘
```

**Hero Buttons:**
```
BEFORE:
[Xem Sưu Tập]  [Câu Chuyện]

AFTER:
[Xem Sưu Tập]  [Câu Chuyện]  [Đăng Nhập Admin]  (Not logged in)
[Xem Sưu Tập]  [Câu Chuyện]  [Vào Admin]        (Logged in)
```

**Login Page:**
```
BEFORE:
- Simple white background
- Basic form
- Text-only inputs

AFTER:
- Gradient animated background
- Modern rounded inputs
- Icon labels
- Demo credentials panel
- Back to home link
- Better error messaging
```

---

## 🧪 Test Checklist

- [ ] Click "Đăng Nhập Admin" từ trang chủ (Hero)
- [ ] Trang Login hiển thị đẹp + gradient
- [ ] Demo credentials hiển thị
- [ ] Input email & password focus ring ok
- [ ] Click back link → redirect về home
- [ ] Login thành công → redirect /admin
- [ ] Check localStorage có token & user
- [ ] Header hiển thị user avatar + Đăng Xuất
- [ ] Hero hiển thị "Vào Admin" thay vì "Đăng Nhập"
- [ ] Click "Vào Admin" → redirect /admin
- [ ] Logout → back to login buttons
- [ ] Mobile menu works on small screens

---

## 🚀 Khởi Động & Test

### **Start Frontend:**
```bash
cd C:\Users\vanlo\all\webapp\unigo\src\frontend
npm run dev
```

### **Access:**
```
Frontend: http://localhost:5174
Login: http://localhost:5174/login
Admin: http://localhost:5174/admin
```

### **Admin Test Credentials:**
```
Email: admin@unigo.com
Password: admin123
```

---

## 💾 Tệp Có Sẵn Để Tham Khảo

1. **API_LOGIN_GUIDE.md** - Chi tiết API login
2. **FRONTEND_API_CONNECTION.md** - Config axios & API
3. **API_TESTING_GUIDE.md** - Toàn bộ endpoints

---

## ✅ Kết Luận

```
✅ Login page được thiết kế lại đẹp & hiện đại
✅ Header thêm logic show/hide based on auth
✅ Hero thêm nút CTA "Đăng Nhập Admin"
✅ Auth state được manage bằng useAuthStore
✅ API login được gắn vào form
✅ Token & user tự động lưu localStorage
✅ UI responsive trên mobile & desktop

🎉 Trang đăng nhập đã hoàn thiện!
```

