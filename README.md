# 🎀 Unigo – Món Nhỏ Handmade

Nền tảng thương mại điện tử cho sản phẩm handmade, xây dựng với **React**, **Node.js**, **PostgreSQL** và **Cloudinary**.  
Thương hiệu vòng tay handmade dành cho học sinh, sinh viên – mang phong cách trẻ trung và văn hoá Việt Nam.

🔗 **Repo:** https://github.com/vanloi0101/unigo  
📱 **Mạng xã hội:** [Facebook](https://www.facebook.com/profile.php?id=61582809680392) · [TikTok @mon_nho_unigo](https://www.tiktok.com/@mon_nho_unigo) · Zalo: 0346.450.546

---

## 📊 Trạng thái dự án

| Thành phần | Trạng thái | Chi tiết |
|-----------|--------|---------|
| **Backend API** | ✅ Hoàn chỉnh | REST API đầy đủ, xác thực JWT, tìm kiếm/lọc |
| **Frontend** | ✅ Hoàn chỉnh | Trang sản phẩm, giỏ hàng, admin panel, responsive |
| **Cơ sở dữ liệu** | ✅ Hoàn chỉnh | PostgreSQL + Prisma ORM, migration đầy đủ |
| **Xác thực** | ✅ Hoàn chỉnh | JWT + bcryptjs, đăng nhập/đăng ký an toàn |
| **Upload ảnh** | ✅ Hoàn chỉnh | Cloudinary, validation file |
| **Tìm kiếm/Lọc** | ✅ Hoàn chỉnh | Tìm theo tên, danh mục, khoảng giá, phân trang |
| **Trang chủ** | ✅ Hoàn chỉnh | Hero, giới thiệu thương hiệu, blog preview, social feed |
| **Blog/Tin tức** | ✅ Hoàn chỉnh | Bài viết, brand story, SEO meta tags |
| **Giỏ hàng** | ✅ Hoàn chỉnh | Persistent state với Zustand + Zalo order |
| **CORS/Rate limit** | ✅ Đã sửa | Rate limiter sau CORS, tăng giới hạn dev |

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT + bcryptjs
- **Upload:** Multer + Cloudinary
- **Validation:** Zod
- **Rate limiting:** express-rate-limit (sau CORS middleware)

### Frontend
- **Framework:** React 18 + Vite
- **State:** Zustand
- **Styling:** Tailwind CSS
- **HTTP:** Axios với interceptors
- **Forms:** React Hook Form + Zod
- **UI:** Lucide React, rc-slider
- **Notifications:** React Hot Toast

### DevOps
- **Container:** Docker + Docker Compose
- **Web server:** Nginx (production)
- **DB:** PostgreSQL 15

## 🎨 Tính năng

### Người dùng
- ✅ Đăng ký / đăng nhập JWT
- ✅ Duyệt sản phẩm với tìm kiếm & lọc nâng cao (danh mục, khoảng giá, sắp xếp)
- ✅ Giỏ hàng (persistent Zustand)
- ✅ Đặt hàng qua Zalo
- ✅ Trang chi tiết sản phẩm
- ✅ Blog / Tin tức
- ✅ Responsive mobile

### Admin
- ✅ Quản lý sản phẩm (CRUD + upload ảnh Cloudinary)
- ✅ Quản lý banner
- ✅ Quản lý bài viết / brand story
- ✅ Quản lý danh mục
- ✅ Quản lý tác giả

### Trang chủ
- ✅ Hero banner động (lấy từ API)
- ✅ Giới thiệu thương hiệu Unigo (câu chuyện sinh viên + văn hoá Việt)
- ✅ Sản phẩm nổi bật
- ✅ Blog preview
- ✅ Social feed (Facebook, TikTok)
- ✅ Floating Zalo button

##  Lỗi đã sửa

| Lỗi | Mô tả | Cách sửa |
|-----|--------|----------|
| **Bộ lọc trùng lặp** | Sidebar lọc hiện 2 lần trên desktop | Wrap mobile drawer trong `md:hidden` |
| **CORS + 429** | Rate limiter trước CORS → response 429 không có CORS header | Chuyển `app.use(generalLimiter)` sau CORS middleware |
| **Brand story ảnh** | `About.jsx` đọc sai field (`res?.post` thay vì `res?.data`) | Sửa thành `res?.data \|\| res?.post \|\| res` |
| **Social links sai** | Facebook/TikTok dùng URL cũ | Cập nhật đúng URL thực tế |
| **Sort dropdown** | Phần sắp xếp hiển thị dạng giá tiền | Đã đúng — dropdown `<select>` với options Mới nhất / Giá thấp → cao |

## 🚀 Khởi động nhanh

### Option 1: Docker
```bash
docker-compose up -d
docker-compose exec backend npx prisma migrate dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
```

### Option 2: Local

**Backend:**
```bash
cd src/backend
npm install
# Tạo file .env (xem mục Environment Variables)
npx prisma migrate dev
npm run dev
```

**Frontend:**
```bash
cd src/frontend
npm install
npm run dev
```

## 🔐 Environment Variables

### Backend (`.env`)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/unigo
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secure-secret-key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (`.env.local`)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## 📡 API Endpoints chính

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/products` | Lấy danh sách sản phẩm (có lọc) |
| GET | `/api/products/:id` | Chi tiết sản phẩm |
| POST | `/api/products` | Tạo sản phẩm (admin) |
| PUT | `/api/products/:id` | Sửa sản phẩm (admin) |
| DELETE | `/api/products/:id` | Xóa sản phẩm (admin) |
| GET | `/api/posts/:slug` | Lấy bài viết theo slug |
| GET | `/api/posts/latest` | Bài viết mới nhất |
| GET | `/api/banner` | Banner trang chủ |

## 📁 Cấu trúc thư mục

```
unigo/
├── src/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── middlewares/
│   │   │   ├── services/
│   │   │   ├── schemas/
│   │   │   ├── config/
│   │   │   └── index.js
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── migrations/
│   └── frontend/
│       └── src/
│           ├── components/
│           ├── pages/
│           ├── store/
│           ├── hooks/
│           ├── api/
│           └── utils/
├── docker-compose.yml
└── nginx-production.conf
```

## 📞 Liên hệ

- **Zalo:** [0346.450.546](https://zalo.me/0346450546)
- **Facebook:** [Unigo – Món Nhỏ](https://www.facebook.com/profile.php?id=61582809680392)
- **TikTok:** [@mon_nho_unigo](https://www.tiktok.com/@mon_nho_unigo)

---

**Cập nhật lần cuối:** Tháng 4, 2026 · **Phiên bản:** 1.1.0 · **Trạng thái:** Đang phát triển 🚀

