# Dự Án Web App: Mon Nho Handmade (Unigo)

Dự án hiện tại là một trang web thương mại điện tử / blog tĩnh được xây dựng bằng **React**, **Vite** và **Tailwind CSS**. Hiện tại nó bao gồm giao diện người dùng (khách hàng) và một bảng điều khiển quản trị (Admin Dashboard).

---

## 1. Các Chức Năng Hiện Có (Frontend)
Dự án đã có cấu trúc giao diện khá đầy đủ và được chia component rõ ràng:

### Giao diện Khách hàng (Public)
*   **Trang chủ (Home):** Nơi hiển thị tổng quan.
*   **Hero Section:** Banner chính thu hút người biểu diễn.
*   **Trust Badges:** Hiển thị các tiêu chí uy tín của cửa hàng.
*   **Danh sách sản phẩm (Product Section):** Hiển thị các sản phẩm dưới dạng lưới (Product Card).
*   **Product Modal:** Xem nhanh chi tiết sản phẩm (Popup).
*   **Giới thiệu (About):** Phần thông tin về cửa hàng.
*   **Social Feed:** Tích hợp hiển thị tin tức mạng xã hội.
*   **Nút tương tác nổi (Floating Action):** Nút gọi, chat nhanh.

### Giao diện Quản trị (Admin)
*   **Admin Dashboard:** Tổng quan thống kê (lượt xem, đơn hàng, doanh thu, bài viết) và danh sách sản phẩm xem nhiều nhất.
*   **Quản lý Sản phẩm (Admin Products):** Giao diện thêm, sửa, xóa sản phẩm.
*   **Quản lý Bài viết (Admin Posts):** Giao diện quản lý nội dung blog/bài đăng.
*   **Cài đặt (Admin Settings):** Tùy chỉnh thông tin hệ thống.

*(Lưu ý: Hiện tại tất cả các chức năng trên đều đang sử dụng dữ liệu giả/mock data và chưa có logic xử lý thực tế).*

---

## 2. Phần Frontend Cần Cải Thiện Những Gì?
Để biến giao diện tĩnh hiện tại thành một ứng dụng web hoàn chỉnh, Frontend cần bổ sung các công việc sau:

1.  **Tích hợp API thực tế:** Thay thế toàn bộ dữ liệu mẫu trong `data/products.js` bằng việc lấy dữ liệu từ Backend thông qua `Axios` hoặc `Fetch API` (khuyên dùng thêm `React Query` để quản lý caching).
2.  **Bảo mật & Authentication (Xác thực):**
    *   Thêm trang Đăng nhập / Đăng ký.
    *   Bảo vệ các route của Admin (Protected Routes) - chỉ cho phép người dùng có token hợp lệ mới được truy cập `/admin`.
3.  **Quản lý trạng thái (State Management):**
    *   Xây dựng chức năng Giỏ hàng (Cart Context hoặc Redux Toolkit / Zustand).
    *   Lưu trữ trạng thái người dùng khi đăng nhập.
4.  **Xử lý Form & Validation:** Sử dụng `React Hook Form` kết hợp với `Yup` hoặc `Zod` để kiểm tra dữ liệu đầu vào khi Admin thêm sản phẩm, hoặc khách hàng nhập thông tin đặt hàng.
5.  **Trải nghiệm người dùng (UX):**
    *   Thêm các trạng thái hiển thị đang tải (Loading Spinner / Skeleton).
    *   Thêm thông báo (Toast notifications) khi hành động thành công hay thất bại (VD: "Đã thêm vào giỏ hàng").
6.  **Tối ưu SEO:** Cần sử dụng thư viện như `React Helmet` để thay đổi title và meta tags cho từng trang.

---

## 3. Đề Xuất Ngôn Ngữ / Công Nghệ Cho Backend
Dự án hiện tại hoàn toàn trống phần Backend (thư mục `backend` chưa có gì). Dưới đây là 2 tùy chọn phù hợp nhất để xây dựng Backend cho dự án này:

### Lựa chọn 1: Node.js (với Express.js hoặc NestJS) - Khuyên dùng
*   **Lý do:** Frontend đang dùng React (Javascript), việc dùng Node.js cho Backend sẽ tạo ra sự đồng nhất toàn dải (Fullstack JS). Lập trình viên dễ dàng chuyển đổi qua lại giữa code Frontend và Backend.
*   **Cơ sở dữ liệu:** Thường kết hợp rất tốt với MongoDB (MERN stack) hoặc PostgreSQL.
*   **Phù hợp với:** Các dự án e-commerce quy mô vừa, cần thời gian ra mắt (time-to-market) nhanh.

### Lựa chọn 2: Golang (Sử dụng framework Gin hoặc Fiber)
*   **Lý do:** Tên thư mục gốc của dự án bạn đang là `unigo`, nếu định hướng ban đầu là Go thì đây là một lựa chọn tuyệt vời. Go xử lý đồng thời siêu việt, tốn rất ít RAM và chạy rất nhanh.
*   **Cơ sở dữ liệu:** Khuyên dùng PostgreSQL cùng với ORM là GORM.
*   **Phù hợp với:** Dự án yêu cầu hiệu suất cao, mở rộng lớn sau này, nơi cần API phản hồi cực nhanh.

### Lựa chọn 3: Python (FastAPI hoặc Django)
*   **Lý do:** Nếu bạn mạnh về Python hoặc muốn làm thêm các tính năng AI tự động gợi ý sản phẩm sau này.

**Khuyến nghị:** Nếu bạn muốn hoàn thành dự án nhanh và dùng chung ngôn ngữ với Frontend, hãy chọn **Node.js (Express + MongoDB)**. Nếu bạn muốn backend hiệu năng cao đỉnh cao, hãy bắt đầu cấu hình **Golang**.
