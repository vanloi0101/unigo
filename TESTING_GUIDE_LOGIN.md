# 🧪 HƯỚNG DẪN TEST TOÀN BỘ HỆ THỐNG

**Trạng thái:** ✅ **Sẵn Sàng Test**  
**Ngày:** April 5, 2026

---

## 📋 Pre-Test Checklist

```
🟢 Backend chạy port 4000
🟢 Frontend chạy port 5174
🟢 PostgreSQL Database active
🟢 Admin account tạo: admin@unigo.com / admin123
🟢 API endpoints test được
🟢 Token lấy được từ login
🟢 Header + Hero cập nhật auth logic
🟢 Login page design đẹp
```

---

## 🚀 Test Plan Đầy Đủ

### **PHASE 1: Test Frontend UI (Không login)**

#### **Test 1.1: Trang Chủ (Home)**

**Steps:**
1. Mở `http://localhost:5174`
2. Verify:
   - [ ] Header hiển thị + Nút "Đăng Nhập Admin" (vàng tím)
   - [ ] Nút "Tư vấn Zalo" hiển thị
   - [ ] Navigation links (Trang chủ, Về Mận, Sản phẩm)
   - [ ] Hero section với 3 buttons:
     - ✅ "Xem Bộ Sưu Tập"
     - ✅ "Câu chuyện của Mận"
     - ✅ "Đăng Nhập Admin" (gradient tím→hồng) ⭐

**Expected:**
```
✅ Page load không lỗi
✅ Header sync với Home
✅ Nút Admin rõ ràng
✅ Mobile responsive
```

---

#### **Test 1.2: Click Nút "Đăng Nhập Admin" từ Hero**

**Steps:**
1. Trên trang Home
2. Scroll xuống Hero section
3. Click nút gradient "Đăng Nhập Admin" 🔐
4. Verify:
   - [ ] Redirect tới `http://localhost:5174/login`
   - [ ] Trang login hiển thị đẹp (gradient bg)
   - [ ] Form có 2 input: Email + Password
   - [ ] Demo credentials panel hiển thị (admin@unigo.com)

**Expected:**
```
✅ Smooth redirect
✅ Login page render properly
✅ Form validate backend
```

---

#### **Test 1.3: Click Nút "Đăng Nhập Admin" từ Header**

**Steps:**
1. Trên trang Home (hoặc bất kỳ page nào)
2. Trên Header, click nút "Đăng Nhập" 🔐
3. Verify:
   - [ ] Redirect tới login page
   - [ ] Same login form appears

**Expected:**
```
✅ Header button works
✅ Navigation consistent
```

---

### **PHASE 2: Test Login Flow**

#### **Test 2.1: Login Thất Bại - Sai Email**

**Steps:**
1. Trên trang `/login`
2. Email input: `wrong@example.com`
3. Password input: `admin123`
4. Click "Đăng Nhập Admin"
5. Verify:
   - [ ] Thấy toast lỗi: "Email hoặc mật khẩu không chính xác"
   - [ ] Vẫn ở trang `/login`
   - [ ] Token không được lưu

**Expected:**
```
❌ Toast error hiển thị
❌ Stay on login page
```

---

#### **Test 2.2: Login Thất Bại - Sai Mật Khẩu**

**Steps:**
1. Email input: `admin@unigo.com`
2. Password input: `wrongpassword`
3. Click "Đăng Nhập Admin"
4. Verify:
   - [ ] Toast lỗi: "Email hoặc mật khẩu không chính xác"
   - [ ] Form không reset (data vẫn lại)

**Expected:**
```
❌ Toast error
❌ Stay on login
```

---

#### **Test 2.3: Login Thành Công ✅**

**Steps:**
1. Email input: `admin@unigo.com`
2. Password input: `admin123`
3. Click "Đăng Nhập Admin"
4. Verify:
   - [ ] Loading spinner hiển thị (2-3s)
   - [ ] Toast success: "✅ Đăng nhập thành công!"
   - [ ] Tự động redirect tới `/admin`
   - [ ] URL thay đổi thành `/admin`

**Expected:**
```
✅ Login success toast
✅ Auto redirect to /admin
✅ Loading spinner ok
```

---

#### **Test 2.4: Token & User Lưu (DevTools)**

**Steps:**
1. Sau khi login thành công
2. Mở DevTools: `F12 → Application → Local Storage`
3. Verify:
   - [ ] `token` key có giá trị JWT (dài)
   - [ ] `user` key có JSON với:
     ```json
     {
       "id": 2,
       "email": "admin@unigo.com",
       "name": "Admin User",
       "role": "ADMIN"
     }
     ```

**Expected:**
```
✅ localStorage.getItem('token') → JWT string
✅ localStorage.getItem('user') → JSON object
```

---

### **PHASE 3: Test After Login**

#### **Test 3.1: Header After Login**

**Steps:**
1. Sau login thành công (vẫn ở `/admin`)
2. Refresh page: `F5`
3. Verify header:
   - [ ] Nút "Đăng Nhập Admin" → MẤT
   - [ ] Thay bằng: Avatar badge + User name "Admin User"
   - [ ] Nút "Đăng Xuất" (nền đỏ) hiển thị

**Expected:**
```
✅ Header update correctly
✅ Show user avatar + name
✅ Show logout button
```

---

#### **Test 3.2: Hero After Login**

**Steps:**
1. Navigate back tới Home: `http://localhost:5174`
2. Verify Hero buttons:
   - [ ] Nút "Đăng Nhập Admin" → MẤT
   - [ ] Thay bằng: "Vào Admin" (gradient) ⭐
   - [ ] Other buttons unchanged

**Expected:**
```
✅ Hero show "Vào Admin"
✅ Click → redirect /admin
```

---

#### **Test 3.3: Click "Vào Admin" (After Login)**

**Steps:**
1. Đang ở trang Home (sau login)
2. Click "Vào Admin" button ở Hero
3. Verify:
   - [ ] Redirect tới `/admin`
   - [ ] Admin dashboard hiển thị

**Expected:**
```
✅ Quick access to admin
✅ Smooth navigation
```

---

### **PHASE 4: Test Logout**

#### **Test 4.1: Logout Button**

**Steps:**
1. Ở bất kỳ page nào (sau login)
2. Click "Đăng Xuất" button ở Header
3. Verify:
   - [ ] Toast logout hiển thị (optional)
   - [ ] Redirect về Home: `/`
   - [ ] Header update: Nút Login lại hiển thị
   - [ ] localStorage xóa token & user

**Expected:**
```
✅ Logout success
✅ Token removed from localStorage
✅ Back to Home
✅ Header reset to not-logged-in state
```

---

#### **Test 4.2: Verify Data Removed**

**Steps:**
1. Sau logout
2. Mở DevTools → Storage → LocalStorage
3. Verify:
   - [ ] `token` key: HẾT (removed)
   - [ ] `user` key: HẾT (removed)

**Expected:**
```
✅ localStorage cleared
```

---

#### **Test 4.3: Back to Login Button**

**Steps:**
1. Sau logout (ở Home)
2. Nút Header quay lại "Đăng Nhập Admin"
3. Click nó
4. Verify:
   - [ ] Redirect tới `/login`
   - [ ] Form rỗng (hoặc có default values)

**Expected:**
```
✅ Back to login flow
```

---

### **PHASE 5: Test Edge Cases**

#### **Test 5.1: Manual Token Removal**

**Steps:**
1. Login successfully → Access `/admin`
2. DevTools → Console:
   ```javascript
   localStorage.removeItem('token');
   ```
3. Refresh page: `F5`
4. Verify:
   - [ ] Redirect về `/login`
   - [ ] ProtectedRoute logic works

**Expected:**
```
✅ ProtectedRoute catches missing token
✅ Redirect to login
```

---

#### **Test 5.2: Direct URL Access to /login (When Logged In)**

**Steps:**
1. Login successfully
2. Manually go to `http://localhost:5174/login`
3. Verify:
   - [ ] Auto redirect tới `/admin`
   - [ ] Not show login form

**Expected:**
```
✅ Redirect authenticated user away from login
```

---

#### **Test 5.3: Browser Back Button After Logout**

**Steps:**
1. Login → Access admin
2. Logout
3. Click browser back button
4. Verify:
   - [ ] Don't accidentally show admin page
   - [ ] Proper auth check happens

**Expected:**
```
✅ Auth state prevents access
```

---

#### **Test 5.4: Mobile Responsive**

**Steps:**
1. Open DevTools → Device Toolbar
2. Set to mobile size (375px width)
3. Test:
   - [ ] Header mobile menu works (FaBars → FaTimes)
   - [ ] Login form responsive
   - [ ] Buttons stack properly
   - [ ] Input fields full width

**Expected:**
```
✅ Responsive design works
✅ Mobile menu toggles
✅ Touch-friendly layout
```

---

### **PHASE 6: API Integration Test**

#### **Test 6.1: Axios Token Injection**

**Steps:**
1. Login successfully
2. DevTools → Network tab
3. Make any API call (e.g., GET /products)
4. Click request → Headers
5. Verify:
   - [ ] Header `Authorization: Bearer <token>` present
   - [ ] Token matches localStorage.getItem('token')

**Expected:**
```
✅ Axios auto-attach token
✅ Correct Authorization header
```

---

#### **Test 6.2: API Error Handling**

**Steps:**
1. Login as admin
2. DevTools → Console:
   ```javascript
   // Manually clear token
   localStorage.removeItem('token');
   // Make API call
   fetch('http://localhost:4000/api/products', {
     headers: { 'Authorization': 'Bearer invalid' }
   })
   ```
3. Verify:
   - [ ] Get 401 response
   - [ ] Axios interceptor catches it

**Expected:**
```
✅ Error handling works
```

---

### **PHASE 7: Admin Dashboard**

#### **Test 7.1: Access Admin (Protected Route)**

**Steps:**
1. Login successfully
2. Navigate to `/admin`
3. Verify:
   - [ ] Admin dashboard loads
   - [ ] Can see admin features
   - [ ] No errors in console

**Expected:**
```
✅ Admin accessible after login
✅ All features load
```

---

## 📊 Test Report Template

```
TEST RESULTS - Login & Auth System
===================================

Date: April 5, 2026
Tester: You
Browser: Chrome / Firefox / Safari

PHASE 1: UI Tests
- [ ] Home page loads
- [ ] Header shows correct buttons
- [ ] Hero buttons functional
- [ ] Responsive design ok

PHASE 2: Login Flow
- [ ] Failed login works
- [ ] Successful login works
- [ ] Token saved in localStorage
- [ ] User data saved

PHASE 3: Post-Login UI
- [ ] Header updates after login
- [ ] Hero button changes
- [ ] Navigation works

PHASE 4: Logout
- [ ] Logout button works
- [ ] localStorage cleared
- [ ] Redirect to home
- [ ] UI resets

PHASE 5: Edge Cases
- [ ] Manual token removal
- [ ] /login redirect when logged in
- [ ] Back button behavior
- [ ] Mobile responsive

PHASE 6: API
- [ ] Token injection works
- [ ] Error handling ok

PHASE 7: Admin
- [ ] Admin dashboard accessible
- [ ] All features work

OVERALL: ✅ PASS / ❌ FAIL
Issues Found: (list any)
Notes: (additional observations)
```

---

## 🚀 Cách Chạy Test Nhanh Nhất

### **Scenario 1: Full Flow Test (10 minutes)**
```
1. Go to http://localhost:5174
2. Click "Đăng Nhập Admin"
3. Enter: admin@unigo.com / admin123
4. Click "Đăng Nhập Admin"
5. See if redirect to /admin success
6. Check Header shows user + logout
7. Click logout
8. Check back to login view
9. Go to home → see "Đăng Nhập Admin" again
```

### **Scenario 2: Quick API Test (5 minutes)**
```
1. Login successfully
2. Open DevTools → Network
3. Navigate to any page with API calls
4. Check if Authorization header present
5. Verify token is correct
```

---

## ✅ Success Criteria

```
✅ Tất cả UI elements render correctly
✅ Login/Logout flow hoạt động smooth
✅ Token lưu & xóa chính xác
✅ Header & Hero update based on auth state
✅ Protected routes work
✅ API calls include token
✅ Mobile responsive
✅ No console errors
```

---

## 🎯 Kết Luận

**Nếu tất cả tests pass:**
```
✅ Login system hoàn toàn hoạt động
✅ Sẵn sàng development tiếp theo
✅ Ready for production-like testing
```

**Nếu có issues:**
- Check console errors: `F12 → Console`
- Check network: `F12 → Network`
- Check localStorage: `F12 → Application → Storage`
- Reading error messages in toast

---

