# Quick Test Guide - API Integration Fix

## 🎯 Mục Tiêu
Verify rằng Frontend hiển thị đầy đủ sản phẩm từ API và tự động update khi có thay đổi

## 🔍 Test Steps

### Step 1: Kiểm Tra Browser Console Logs
1. **Mở DevTools**: F12 hoặc Right-click → Inspect
2. **Vào Console tab**
3. **Truy cập trang**: 
   - Home: http://localhost:5175/ 
   - Products: http://localhost:5175/products
4. **Tìm logs**:
   ```
   ✅ Fetch products response: { payload: {...}, total: 2 }
   ```
   - Nếu thấy → Response mapping đúng ✅
   - Nếu không → Có lỗi mapping ❌

### Step 2: Test Hiển Thị Sản Phẩm
**Home Page (/)**
- [ ] ProductSection hiển thị **2+ sản phẩm**
- [ ] Hình ảnh load đúng (Cloudinary URL)
- [ ] Tên, giá, category hiển thị đúng
- [ ] Giá format VNĐ: "333.333 ₫"

**Products Page (/products)**
- [ ] Grid hiển thị tất cả sản phẩm
- [ ] Sidebar categories list chấp
- [ ] Filter hoạt động (click category → product list filter)
- [ ] Product count hiển thị đúng

### Step 3: Test Create Product (Admin)
**Setup:**
- Đăng nhập vào `/admin` (bất kỳ account nào)
- Mở `/admin/products`

**Test:**
1. Click "Thêm Sản Phẩm" button
2. Fill form:
   - Tên: "Testing Product 123"
   - Description: "Test desc"
   - Price: 99999
   - Stock: 5
   - Category: "test"
   - Image: (upload nếu có)
3. Submit
4. **Verify:**
   - [ ] Toast: "Thêm sản phẩm thành công!"
   - [ ] DevTools Console: `✅ Product created: {...}`
   - [ ] Product list table update ngay (không cần refresh) - **NEW PRODUCT CÓ TRONG DANH SÁCH**
   - [ ] Quay lại / hoặc /products → ProductSection/Grid tự động update (không cần refresh)

### Step 4: Test Update Product (Admin)
1. Trên /admin/products, tìm sản phẩm vừa tạo
2. Click "Edit" button
3. Thay đổi tên: "Testing Product 123 - UPDATED"
4. Submit
5. **Verify:**
   - [ ] Toast: "Cập nhật sản phẩm thành công!"
   - [ ] DevTools Console: `✅ Product updated: {...}`
   - [ ] Product list update ngay
   - [ ] Home/Products page tự động update

### Step 5: Test Delete Product (Admin)
1. Trên /admin/products, tìm sản phẩm vừa update
2. Click "Delete" button
3. Confirm delete
4. **Verify:**
   - [ ] Toast: "Xóa sản phẩm thành công!"
   - [ ] DevTools Console: `✅ Product deleted: {...}`
   - [ ] Product mất khỏi danh sách ngay
   - [ ] Product count giảm (line 2 của ProductAdmin header)

### Step 6: Test Error Handling
**Simulate Error (Optional):**
1. Stop backend server
2. Reload page
3. **Verify:**
   - [ ] ProductSection shows error state: "Oops! Có lỗi xảy ra"
   - [ ] Retry button hoạt động
   - [ ] DevTools Console: `❌ Fetch products error: ...`

## 📊 Expected Results

### Before Fixes (Broken)
```
❌ Home page: 0-1 sản phẩm
❌ Admin add product: không update giao diện
❌ Need refresh để thấy dữ liệu mới
```

### After Fixes (Working)
```
✅ Home page: 2+ sản phẩm (tất cả từ API)
✅ Admin add product: tự động update ProductSection & Products page
✅ Quay lại / hoặc /products: dữ liệu new nhất (no refresh needed)
✅ Console logs rõ ràng
```

## 🐛 Troubleshooting

If không thấy sản phẩm:
1. Check DevTools Console → Có error logs không?
   - `❌ Fetch products error: ...` → Backend issue
   - `undefined` in logs → Response mapping sai

2. Check Network tab:
   - Request tới `http://localhost:5000/api/products`
   - Response status: 200?
   - Response body content?

3. Check Backend:
   ```bash
   # Trong backend terminal
   curl http://localhost:5000/api/products
   # Response phải có: { success: true, data: { products: [...] } }
   ```

4. Check Frontend Store:
   - Open DevTools → Components/Zustand tab
   - Check `useProductStore` state
   - `products` array có data không?

## 💡 Quick Fixes

If sản phẩm vẫn không hiển thị:
1. Clear localStorage: `localStorage.clear()`
2. Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
3. Check if port 5000 (backend) đang chạy
4. Check if frontend port 5175 đang chạy

## 📞 Support

If vấn đề vẫn tiếp tục:
1. Kiểm tra `API_INTEGRATION_FIX.md` để hiểu root cause
2. Review file changes:
   - `useProductStore.js` - response mapping
   - `ProductSection.jsx` - Zustand vs React Query
   - `AdminProducts.jsx` - refetch logic
3. Enable verbose logging:
   - Thêm `console.log` trong store functions
   - Check Chrome DevTools Application/Storage
