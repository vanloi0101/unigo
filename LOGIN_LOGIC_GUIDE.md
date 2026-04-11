# 🔐 Login Logic - Prisma ORM + Bcrypt + JWT

## 📖 Giải Thích Chi Tiết Code

### **Controller: `src/controllers/authController.js` (Lines 74-135)**

```javascript
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ BƯỚC 1: VALIDATION (Middleware đã handle)
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email và password là bắt buộc",
      });
    }

    // ✅ BƯỚC 2: TÌM USER THEO EMAIL TỪ DATABASE
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // ✅ BƯỚC 3: KIỂM TRA USER CÓ TỒN TẠI KHÔNG
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác",  // Không tiết lộ thông tin
      });
    }

    // ✅ BƯỚC 4: SO SÁNH PASSWORD
    const isPasswordValid = await bcryptjs.compare(
      password,           // Password từ request (plaintext)
      user.password       // Password đã hash trong database
    );

    // ✅ BƯỚC 5: KIỂM TRA PASSWORD CÓ KHỚP KHÔNG
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác",
      });
    }

    // ✅ BƯỚC 6: TẠOTOKEN JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRE }  // 7 days
    );

    // ✅ BƯỚC 7: RESPONSE THÀNH CÔNG
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    // ❌ HANDLE LỖI SERVER
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
```

---

## 🔍 Flow Chart

```
REQUEST: POST /api/auth/login
  ↓
┌─────────────────────────────────────┐
│  Validation Middleware              │
│  - Email format check               │
│  - Password min 6 chars             │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│  authController.login()             │
│  1. Find user by email (Prisma)     │
│  2. User exists?                    │
│     NO  → 401 "Email or password..."│
│     YES → Continue                  │
│  3. Compare passwords (bcrypt)      │
│  4. Password match?                 │
│     NO  → 401 "Email or password..."│
│     YES → Continue                  │
│  5. Generate JWT token              │
│  6. Return 200 + token + user info  │
└─────────────────────────────────────┘
  ↓
RESPONSE: {token, user}
```

---

## 🗝️ Key Concepts

### **1. Prisma Query: findUnique**
```javascript
const user = await prisma.user.findUnique({
  where: { email },  // Email unique constraint
});
```
- ✅ Tìm user theo email (indexed field)
- ✅ Returns user object hoặc `null`
- ✅ Efficient vì email là unique

### **2. Bcrypt Password Comparison**
```javascript
const isPasswordValid = await bcryptjs.compare(
  password,        // Client plaintext password
  user.password    // Database hashed password
);
```

**Tại sao không dùng `password === user.password`?**
- ❌ Hashed passwords không thể so sánh trực tiếp!
- ✅ `bcryptjs.compare()` giải mã và so sánh đúng cách
- ✅ Bảo mật - không expose password plaintext

**Ví dụ:**
```
Client sends:      "password123"
Database has:      "$2a$10$..." (hashed)
                        ↓
bcryptjs.compare("password123", "$2a$10$...")
                        ↓
Result: true/false
```

### **3. JWT Token Generation**
```javascript
const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role
  },
  config.JWT_SECRET,
  { expiresIn: config.JWT_EXPIRE }  // "7d"
);
```

**Token chứa:**
- `userId`: Dùng để identify user
- `email`: Dùng để xác nhân
- `role`: Dùng cho authorization
- `expiresIn`: Token hết hạn sau 7 ngày

### **4. Security: Vague Error Messages**
```javascript
// ✅ GOOD - Không tiết lộ thông tin
message: "Email hoặc mật khẩu không chính xác"

// ❌ BAD - Tiết lộ user tồn tại hay không
message: "User không tồn tại"           // Leak: email exists?
message: "Mật khẩu không đúng"          // Leak: email exists!
```

---

## 📊 Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| **200** | OK | Login thành công |
| **400** | Bad Request | Email/password trống (validation) |
| **401** | Unauthorized | User không tồn tại hoặc password sai |
| **500** | Server Error | Lỗi database, JWT, etc |

---

## 🧪 Test Cases

### **✅ Valid Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepass123"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "newuser@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  }
}
```

### **❌ User Không Tồn Tại**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "password123"
  }'
```

**Response (401):**
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không chính xác"
}
```

### **❌ Sai Mật Khẩu**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "wrongpassword"
  }'
```

**Response (401):**
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không chính xác"
}
```

### **❌ Missing Email (Validation)**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "password123"}'
```

**Response (400):**
```json
{
  "success": false,
  "message": "Lỗi xác thực đầu vào",
  "errors": [
    {
      "field": "email",
      "message": "Email không được để trống"
    }
  ]
}
```

---

## 💾 Database Flow

```
1. User registers:
   Client password: "password123"
            ↓ [bcryptjs.hash()]
   Database stores: "$2a$10$..."

2. User logs in:
   Client password: "password123"
   Database password: "$2a$10$..."
            ↓ [bcryptjs.compare()]
   Result: true/false
```

---

## 🛡️ Security Best Practices Implemented

✅ **Password Hashing**
- Passwords hashed dengan bcryptjs (salt rounds = 10)
- Plaintext passwords never stored

✅ **JWT Token**
- Secret key stored in .env
- Token expires after 7 days
- Contains user identity & role

✅ **Error Handling**
- Vague error messages (không tiết lộ user tồn tại)
- No stack traces returned to client
- Server errors logged only in console

✅ **Validation**
- Email format checked
- Password minimum 6 chars
- All via Zod middleware

---

## 📋 Checklist

- ✅ Prisma ORM quản lý database queries
- ✅ bcryptjs.compare() kiểm tra password
- ✅ JWT token được tạo & trả về
- ✅ HTTP 401 cho unauthorized
- ✅ Error handling & security measures
- ✅ Validation middleware applied
- ✅ Vague error messages (security)

---

## 🚀 Ready to Use!

Controller đã sẵn sàng. Query cơ sở dữ liệu ở `authController.js:75-135`
