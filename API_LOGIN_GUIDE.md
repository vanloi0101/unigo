# 🔐 HƯỚNG DẪN TEST API & ĐĂNG NHẬP

**Status:** ✅ **API đang chạy & có thể test được**

---

## 🎯 Tài Khoản Test Có Sẵn

### **Admin Account** (Có quyền cao nhất)
```
Email: admin@unigo.com
Password: admin123
Role: ADMIN
```

### **Customer Account** (Người mua)
```
Email: test@example.com
Password: password
Role: CUSTOMER
```

---

## 🚀 Cách Đăng Nhập & Lấy Token

### **Phương Pháp 1: Từ Frontend (http://localhost:5174)**

1. **Mở ứng dụng**
   ```
   http://localhost:5174
   ```

2. **Đi tới trang Login**
   - Click "Login" hoặc vào `/login`

3. **Nhập thông tin Admin**
   ```
   Email: admin@unigo.com
   Password: admin123
   ```

4. **Nhấn "Đăng Nhập"**
   - Token sẽ được lưu trong `localStorage`
   - Sẽ redirect tới Admin Dashboard

5. **Kiểm tra Token (mở Browser DevTools)**
   ```javascript
   // Ctrl+Shift+J => Console
   localStorage.getItem('token')
   ```

---

### **Phương Pháp 2: Từ API Trực Tiếp (cURL/PowerShell)**

#### **cURL Command**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@unigo.com",
    "password": "admin123"
  }'
```

#### **PowerShell Command**
```powershell
$body = @{
  email = "admin@unigo.com"
  password = "admin123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login" `
  -Method POST `
  -Body $body `
  -ContentType "application/json" `
  -UseBasicParsing

$data = $response.Content | ConvertFrom-Json
Write-Host "Token: $($data.token)"
Write-Host "User: $($data.user.email)"
```

---

## 📝 Admin Token Hiện Tại (Valid)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWRtaW5AdW5pZ28uY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzc1NDAzMzMwLCJleHAiOjE3NzYwMDgxMzB9.b3OlgMUjPQUe5UKwO__me7vXT1VBZKx8bm-CqL7HAmg
```

**Cách sử dụng:** Copy token này vào header của API request:
```
Authorization: Bearer <token>
```

---

## 🧪 Test API Với Token

### **Lấy Profile Người Dùng**

#### **PowerShell**
```powershell
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWRtaW5AdW5pZ28uY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzc1NDAzMzMwLCJleHAiOjE3NzYwMDgxMzB9.b3OlgMUjPQUe5UKwO__me7vXT1VBZKx8bm-CqL7HAmg"

Invoke-WebRequest -Uri "http://localhost:4000/api/auth/profile" `
  -Method GET `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
  } `
  -UseBasicParsing | ForEach-Object {$_.Content | ConvertFrom-Json}
```

#### **Expected Response**
```json
{
  "success": true,
  "message": "Lấy thông tin người dùng thành công",
  "user": {
    "id": 2,
    "email": "admin@unigo.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

---

### **Lấy Danh Sách Sản Phẩm**

```powershell
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWRtaW5AdW5pZ28uY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzc1NDAzMzMwLCJleHAiOjE3NzYwMDgxMzB9.b3OlgMUjPQUe5UKwO__me7vXT1VBZKx8bm-CqL7HAmg"

Invoke-WebRequest -Uri "http://localhost:4000/api/products?page=1&limit=10" `
  -Method GET `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
  } `
  -UseBasicParsing | ForEach-Object {$_.Content | ConvertFrom-Json}
```

---

## 📊 Token Structure (JWT Decode)

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": 2,
  "email": "admin@unigo.com",
  "role": "ADMIN",
  "iat": 1775403330,      // Issued at
  "exp": 1776008130       // Expires after 7 days
}

Signature: b3OlgMUjPQUe5UKwO__me7vXT1VBZKx8bm-CqL7HAmg
```

---

## ⏱️ Token Expiration

- **Issued:** April 5, 2026
- **Expires:** April 12, 2026 (7 days)
- **Status:** ✅ Valid & Active

**Khi token hết hạn:**
1. Đăng nhập lại để lấy token mới
2. Hoặc gọi endpoint `/auth/login` để refresh

---

## 🔄 Quy Trình Đăng Nhập Đầy Đủ

```
┌─────────────────────────────────┐
│  1. User nhập email & password  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  2. POST /api/auth/login        │
│     Request body:               │
│     {                           │
│       "email": "...",           │
│       "password": "..."         │
│     }                           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  3. Backend verify password     │
│     (so sánh bcryptjs hash)     │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  4. Backend tạo JWT token       │
│     (ký với JWT_SECRET)         │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  5. Trả về response:            │
│     {                           │
│       "success": true,          │
│       "token": "eyJ...",        │
│       "user": {...}             │
│     }                           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  6. Frontend lưu token vào      │
│     localStorage                │
│     localStorage.setItem(       │
│       'token', response.token   │
│     )                           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  7. Sử dụng token cho requests  │
│     Authorization: Bearer ...   │
│                                 │
│     axiosClient tự động attach  │
│     token vào header            │
└─────────────────────────────────┘
```

---

## 🛠️ Troubleshooting

### **Lỗi: "Email hoặc mật khẩu không chính xác"**
```
Nguyên nhân: Email không tồn tại hoặc password sai
Cách giải:
1. Đăng ký tài khoản mới
2. Hoặc sử dụng tài khoản test có sẵn (admin@unigo.com)
```

### **Lỗi: "Email đã được đăng ký"**
```
Nguyên nhân: Email này đã được tạo rồi
Cách giải:
1. Dùng email khác
2. Hoặc đăng nhập bằng tài khoản đó
```

### **Lỗi: "Token không hợp lệ" hoặc "Unauthorized"**
```
Nguyên nhân: Token hết hạn hoặc sai format
Cách giải:
1. Đăng nhập lại để lấy token mới
2. Hoặc check token format: "Bearer <token>"
```

### **Frontend không nhận token**
```
Kiểm tra:
1. localStorage có token? console.log(localStorage.getItem('token'))
2. API call có gửi header Authorization?
3. Token có format đúng? "Bearer eyJ..."
```

---

## ✅ Checklist Test API

- [ ] **Backend chạy** trên port 4000
- [ ] **Frontend chạy** trên port 5173 hoặc 5174
- [ ] **Có thể đăng nhập** bằng admin@unigo.com / admin123
- [ ] **Nhận được token** từ /auth/login
- [ ] **Token lưu** trong localStorage
- [ ] **Gọi API** với Authorization header
- [ ] **Lấy danh sách products** thành công
- [ ] **Tạo/sửa/xóa products** thành công
- [ ] **Tạo order** thành công
- [ ] **Cập nhật order status** thành công

---

## 🎯 Kết Luận

```
Frontend: ✅ http://localhost:5174 (hoặc 5173)
Backend:  ✅ http://localhost:4000/api
Database: ✅ PostgreSQL (Docker)

Admin Account: ✅ Tạo thành công
API Login:     ✅ Hoạt động
Token:         ✅ Có thể lấy được

🎉 Sẵn sàng test toàn bộ hệ thống!
```

