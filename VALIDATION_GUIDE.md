# 🔐 API Validation Middleware - Login & Register

## 📋 Tổng Quan

Middleware validation sử dụng **Zod** để validate tất cả request input gửi đến API endpoints:
- ✅ **POST /api/auth/login**
- ✅ **POST /api/auth/register**

---

## 📁 File Structure

```
src/backend/
├── src/
│   ├── schemas/
│   │   └── authSchema.js          # Zod validation schemas
│   ├── middlewares/
│   │   └── validationMiddleware.js  # Validation middleware
│   └── routes/
│       └── authRoutes.js          # Updated with validation
```

---

## 📝 Validation Rules

### **Login (POST /api/auth/login)**

| Field | Rule | Ví dụ |
|-------|------|-------|
| **email** | ✓ Bắt buộc | `user@example.com` |
| | ✓ Email đúng định dạng | Không chấp nhận: `invalid-email` |
| **password** | ✓ Bắt buộc | |
| | ✓ Min 6 ký tự | `password123` |

### **Register (POST /api/auth/register)**

| Field | Rule | Ví dụ |
|-------|------|-------|
| **email** | ✓ Bắt buộc | `user@example.com` |
| | ✓ Email đúng định dạng | |
| **password** | ✓ Bắt buộc | |
| | ✓ Min 6, Max 50 ký tự | `securepass123` |
| **name** | ✓ Bắt buộc | `John Doe` |
| | ✓ Min 2, Max 50 ký tự | |

---

## 🧪 Test Cases

### **✅ Valid Login Request**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "user": { ... },
  "token": "..."
}
```

---

### **❌ Missing Email**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "password": "password123"
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Lỗi xác thực đầu vào",
  "errors": [
    {
      "field": "email",
      "message": "Email là bắt buộc"
    }
  ],
  "timestamp": "2026-04-08T00:30:00.000Z"
}
```

---

### **❌ Invalid Email Format**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123"
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Lỗi xác thực đầu vào",
  "errors": [
    {
      "field": "email",
      "message": "Email không đúng định dạng"
    }
  ],
  "timestamp": "2026-04-08T00:30:00.000Z"
}
```

---

### **❌ Password Too Short**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "123"
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Lỗi xác thực đầu vào",
  "errors": [
    {
      "field": "password",
      "message": "Mật khẩu phải có ít nhất 6 ký tự"
    }
  ],
  "timestamp": "2026-04-08T00:30:00.000Z"
}
```

---

### **❌ Multiple Validation Errors**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid",
    "password": "123"
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Lỗi xác thực đầu vào",
  "errors": [
    {
      "field": "email",
      "message": "Email không đúng định dạng"
    },
    {
      "field": "password",
      "message": "Mật khẩu phải có ít nhất 6 ký tự"
    }
  ],
  "timestamp": "2026-04-08T00:30:00.000Z"
}
```

---

### **✅ Valid Register Request**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepass123",
    "name": "John Doe"
  }'
```

---

## 🛡️ Middleware Features

✅ **Type-Safe Validation** - Sử dụng Zod schema
✅ **Clear Error Messages** - Thông báo chi tiết từng field
✅ **Automatic Sanitization** - Email tự động chuyển lowercase
✅ **HTTP 400 Response** - Conform RESTful API standards
✅ **Error Tracking** - Timestamp cho mỗi error response

---

## 🔧 Mở Rộng (Adding More Validations)

### Cách thêm validation cho endpoint khác:

1. **Tạo schema mới** trong `src/schemas/authSchema.js`:
```javascript
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});
```

2. **Áp dụng vào route**:
```javascript
router.post(
  "/change-password",
  authenticateToken,
  validateRequest(changePasswordSchema),
  changePassword
);
```

---

## 📚 Tài Liệu Tham Khảo

- **Zod Documentation**: https://zod.dev
- **Express Middleware**: https://expressjs.com/en/guide/using-middleware.html

---

## ✨ Lợi Ích

1. **Bảo mật cao** - Validate input trước khi processing
2. **Tránh lỗi** - Catch invalid data sớm
3. **Dễ bảo trì** - Schema định nghĩa rõ ràng
4. **Reusable** - Dùng lại middleware cho nhiều routes
5. **DRY Principle** - Không duplicate validation logic

---
