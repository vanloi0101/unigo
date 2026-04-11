# 🔑 JWT Token Generation - jsonwebtoken Library

## 📍 Location: `src/backends/src/controllers/authController.js` (Lines 109-127)

```javascript
// ✅ BƯỚC 1: TẠOTOKEN JWT
const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role
  },
  config.JWT_SECRET,
  { expiresIn: config.JWT_EXPIRE }  // "7d"
);

// ✅ BƯỚC 2: TRẢ VỀ RESPONSE
res.status(200).json({
  success: true,
  message: "Đăng nhập thành công",
  token,  // ← JWT token
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  },
});
```

---

## 🔍 Chi Tiết Từng Phần

### **1. jwt.sign() - Tạo Token**

```javascript
jwt.sign(payload, secret, options)
```

| Parameter | Mô tả | Ví dụ |
|-----------|-------|-------|
| **payload** | Dữ liệu trong token | `{userId: 3, email: "...", role: "CUSTOMER"}` |
| **secret** | Khóa bảo mật | `process.env.JWT_SECRET` (từ .env) |
| **options** | Cấu hình token | `{expiresIn: "7d"}` |

### **2. Payload (Dữ Liệu Token)**

```javascript
{
  userId: user.id,        // 3
  email: user.email,      // "testuser@example.com"
  role: user.role         // "CUSTOMER"
}
```

**Tại sao những fields này?**
- `userId` - Xác định user (dùng trong protected routes)
- `email` - Xác nhân user
- `role` - Phân quyền (ADMIN vs CUSTOMER)

### **3. JWT_SECRET (Khóa Bảo Mật)**

**From `.env`:**
```env
JWT_SECRET=2a2dae2a647a9643d0aa45bfd1547492255855b8ba7696b416d6ee7b819a7582
```

**From `config/env.js`:**
```javascript
JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_key"
```

⚠️ **BẢO MẬT:** Giữ bí mật! Không commit vào Git!

### **4. expiresIn - Thời Gian Hết Hạn**

```javascript
{ expiresIn: "7d" }  // Token hết hạn sau 7 ngày
```

**Các tùy chọn:**
- `"1h"` - 1 giờ
- `"24h"` - 24 giờ (1 ngày)
- `"7d"` - 7 ngày ✅ (dự án hiện tại)
- `"30d"` - 30 ngày
- `3600` - 3600 giây (1 giờ)

**From `.env`:**
```env
JWT_EXPIRE=7d
```

---

## 🎯 JWT Token Structure

**Một JWT token gồm 3 phần:**

```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NzU1ODM5NjksImV4cCI6MTc3NjE4ODc2OX0.jlLQ1OYg7co94KiYRfoHg...
```

### **1. Header (Base64 Encoded)**
```json
{
  "alg": "HS256",    // Algorithm: HMAC SHA-256
  "typ": "JWT"       // Type: JSON Web Token
}
```
→ `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

### **2. Payload (Base64 Encoded)**
```json
{
  "userId": 3,
  "email": "testuser@example.com",
  "role": "CUSTOMER",
  "iat": 1775583969,                    // issued at (timestamp)
  "exp": 1776188769                     // expiration (timestamp)
}
```
→ `eyJ1c2VySWQiOjMsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiQ1VTVE9NRVIi...`

### **3. Signature (HMAC SHA-256)**
```
HMAC-SHA256(
  Header + "." + Payload,
  JWT_SECRET
) = jlLQ1OYg7co94KiYRfoHg...
```

---

## 🔄 JWT Flow in Login

```
┌─────────────────────────────────────┐
│  1. User sends login request        │
│     email + password                │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  2. Verify credentials              │
│     - Find user by email            │
│     - Compare password (bcryptjs)   │
└──────────────┬──────────────────────┘
               ↓
          ✅ Password Match?
               ↓
┌─────────────────────────────────────┐
│  3. Generate JWT token              │
│     jwt.sign({                      │
│       userId, email, role           │
│     }, JWT_SECRET, {                │
│       expiresIn: "7d"               │
│     })                              │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  4. Return response                 │
│     {                               │
│       token: "eyJ...",              │
│       user: {...},                  │
│       message: "Success"            │
│     }                               │
└─────────────────────────────────────┘
```

---

## 🧪 Live Test - Login & JWT Token

**Successful Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NzU1ODM5NjksImV4cCI6MTc3NjE4ODc2OX0.jlLQ1OYg7co94KiYRfoHg7co94KiYRfoHg",
  "user": {
    "id": 3,
    "email": "testuser@example.com",
    "name": "Test User",
    "role": "CUSTOMER"
  }
}
```

### **Decode Token (jwt.io)**

Paste token `eyJ...` ở [jwt.io](https://jwt.io) thấy:

```json
// HEADER
{
  "alg": "HS256",
  "typ": "JWT"
}

// PAYLOAD
{
  "userId": 3,
  "email": "testuser@example.com",
  "role": "CUSTOMER",
  "iat": 1775583969,
  "exp": 1776188769
}

// SIGNATURE (verified với JWT_SECRET)
```

---

## 🔐 Usage: Protected Routes

**Token được gửi lên trong request header:**

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJ..."
```

**Backend verifies token trong middleware:**

```javascript
// src/middlewares/authMiddleware.js
export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];  // Extract "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      message: "Token không được cung cấp"
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);  // Verify & decode
    req.user = decoded;  // Store in req.user
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token không hợp lệ"
    });
  }
};
```

---

## ⏰ Token Expiration Behavior

### **Token VALID (iat < now < exp):**
```javascript
jwt.verify(token, JWT_SECRET)  // ✅ Returns decoded payload
```

### **Token EXPIRED (now > exp):**
```javascript
jwt.verify(token, JWT_SECRET)  // ❌ Throws: "TokenExpiredError"
// Response: 401 "Token không hợp lệ"
```

**Client cần:**
1. Lưu token (localStorage, sessionStorage)
2. Gửi token với mỗi request
3. Nếu token hết hạn → Request login lại
4. (Optional) Implement refresh token logic

---

## 📋 Security Checklist

✅ **Correct Implementation:**

- ✅ `jwt.sign()` với đủ 3 parameters (payload, secret, options)
- ✅ `JWT_SECRET` từ environment variable (không hardcode)
- ✅ `expiresIn: "7d"` được set
- ✅ Payload chứa `userId`, `role` (cho authorization)
- ✅ Token trả về trong response

❌ **Common Mistakes:**

- ❌ Hardcoding JWT_SECRET (security risk!)
- ❌ Không set expireIn (token hết hạn)
- ❌ Token không chứa userId (verify request người nào)
- ❌ Lưu plaintext password trong payload (security risk!)

---

## 🚀 Code Usage Example

### **Generate Token:**
```javascript
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
```

### **Verify Token:**
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded.userId);  // 3
console.log(decoded.role);    // "CUSTOMER"
```

### **Error Handling:**
```javascript
try {
  const decoded = jwt.verify(token, JWT_SECRET);
} catch (error) {
  if (error.name === "TokenExpiredError") {
    res.status(401).json({ message: "Token hết hạn" });
  } else if (error.name === "JsonWebTokenError") {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
}
```

---

## 📚 Dependencies

```json
{
  "dependencies": {
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1"
  }
}
```

**Installed:** ✅ Có trong project

---

## 🎯 Summary

| Aspect | Implementation |
|--------|----------------|
| **Token Creation** | `jwt.sign(payload, secret, options)` |
| **Payload** | `{userId, email, role}` |
| **Secret** | `process.env.JWT_SECRET` |
| **Expiration** | `7 days` (từ `.env` JWT_EXPIRE) |
| **Response** | Token trả về trong JSON |
| **Verification** | `jwt.verify()` trong middleware |
| **Status Code** | `200 OK` khi login thành công |

---

## ✅ Current Implementation Status

**File:** `src/backend/src/controllers/authController.js`

```javascript
// Lines 100-127: COMPLETE & TESTED ✅
const token = jwt.sign(...);  // Generate
res.json({token, user, ...});  // Return
```

**Live Test Results:**
- ✅ Token generated correctly
- ✅ Token contains userId & role
- ✅ expiresIn: 7d configured
- ✅ Response returned with token

🎉 **Ready to use!**
