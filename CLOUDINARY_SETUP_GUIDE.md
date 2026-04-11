# 🔧 Hướng Dẫn Sửa Lỗi Cloudinary

## ❌ Vấn đề
API báo lỗi: **"Invalid Signature"** 
- Điều này có nghĩa **API Key hoặc API Secret không chính xác**

---

## ✅ Giải pháp: Lấy lại Cloudinary Credentials

### Bước 1: Truy cập Cloudinary
1. Đi tới: https://cloudinary.com/console
2. Đăng nhập vào tài khoản Cloudinary của bạn

### Bước 2: Xem Dashboard
Trong **Dashboard** bạn sẽ thấy:
- **Cloud Name**: tên của cloud (ví dụ: `dwpl6amj8`)
- **API Key**: khóa công khai (dài 12-15 chữ số)
- **API Secret**: khóa riêng tư (chuỗi ký tự dài)

### Bước 3: Kiểm tra API Keys
- Đi tới: https://cloudinary.com/console/settings/api-keys
- Xem và copy chính xác:
  - **API Key** (khóa công khai)
  - **API Secret** (khóa riêng tư)

### ⚠️ LƯU Ý
- **Không có khoảng cách thừa** (trim các space)
- **Phân biệt viết hoa/viết thường**
- **Không bao gồm ngoặc hay dấu ngoặc kép**

---

## 🔧 Cập nhật .env

Mở file: `src/backend/.env`

```env
# Lấy giá trị CHÍNH XÁC từ https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=<YOUR_CLOUD_NAME>
CLOUDINARY_API_KEY=<YOUR_API_KEY>
CLOUDINARY_API_SECRET=<YOUR_API_SECRET>
```

**Ví dụ:**
```env
CLOUDINARY_CLOUD_NAME=abc123xyz
CLOUDINARY_API_KEY=315047592637824
CLOUDINARY_API_SECRET=abcde_FGHijklmno1234PQRSTU5vwxyz
```

---

## 🧪 Kiểm tra Sau Khi Update

### 1. Restart Backend Server
```bash
# Dừng server hiện tại (Ctrl+C)
# Hoặc kill process
taskkill /PID <PID_NUMBER> /F

# Start lại
npm start
```

### 2. Chạy Test Script
```bash
node test-cloudinary.js
```

**Kết quả thành công:**
```
✓ Upload thành công!
✓ Cloudinary credentials hợp lệ!
```

---

## 🆘 Nếu Vẫn Lỗi

### 1. Reset Cloudinary Credentials
- Truy cập: https://cloudinary.com/console/settings/security
- Click "Regenerate API Secret"
- Copy credentials mới vào `.env`

### 2. Kiểm tra Permissions
- Đảm bảo API Key có quyền upload:
  - https://cloudinary.com/console/settings/api-keys
  - Xem "Security Settings"

### 3. Xóa Cache Node.js
```bash
# Xóa node_modules
rm -r node_modules
# Cài lại
npm install
# Start server
npm start
```

### 4. Kiểm tra Tài Khoản Cloudinary
- Truy cập https://cloudinary.com/
- Đăng nhập và xem dashboard
- Đảm bảo tài khoản còn hoạt động

---

## 📋 Checklist

- [ ] Truy cập https://cloudinary.com/console
- [ ] Copy chính xác **Cloud Name**, **API Key**, **API Secret**
- [ ] Cập nhật `src/backend/.env` 
- [ ] Restart backend server
- [ ] Chạy `node test-cloudinary.js`
- [ ] Kiểm tra kết quả xuất hiện "✓ Upload thành công!"

---

## 💡 Tip: Kiểm tra Nhanh

Nếu bạn đã setup credentials mà vẫn lỗi, hãy kiểm tra:

```bash
# Xem giá trị được đọc từ .env
node -e "require('dotenv').config(); console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME); console.log('API_KEY:', process.env.CLOUDINARY_API_KEY); console.log('API_SECRET:', process.env.CLOUDINARY_API_SECRET);"
```

Nếu output là `undefined`, nghĩa là **biến môi trường không đc đọc**.

---

**Tài liệu tham khảo**: https://cloudinary.com/documentation/node.js_integration
