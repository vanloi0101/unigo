# Docker Compose Setup Guide - Unigo

## Yêu cầu
- Docker Desktop 4.0+
- Docker Compose 2.0+

## Cấu trúc Services

### 1. **db** - PostgreSQL 15
- Image: `postgres:15-alpine`
- Port: `5432` (internal)
- Credentials: `unigo_user` / `unigo_password_123`
- Database: `unigo_db`
- Volume: `postgres_data` (persist dữ liệu)

### 2. **backend** - Node.js Server
- Build từ: `./src/backend`
- Port: `3000`
- Depends on: `db` (healthy)
- Environment: DATABASE_URL kết nối tới db service

### 3. **frontend** - React + Nginx
- Build từ: `./src/fronend`
- Port mapping: `8080:80`
- Depends on: `backend`

## Quick Start

### 1. Chuẩn bị môi trường
```bash
# Copy .env.example để tạo .env (nếu cần)
cp .env.example .env

# Chỉnh sửa các giá trị sensitive nếu cần
# - JWT_SECRET
# - CLOUDINARY credentials
```

### 2. Build và chạy tất cả services
```bash
# Build images (lần đầu)
docker-compose build

# Build và start services
docker-compose up -d

# Check trạng thái
docker-compose ps
```

### 3. Kiểm tra các service
```bash
# Database connection
curl http://localhost:3000/api/db-check

# Backend health
curl http://localhost:3000/api/health

# Frontend
open http://localhost:8080
```

## Các lệnh hữu ích

### Xem logs
```bash
# Tất cả services
docker-compose logs -f

# Từng service cụ thể
docker-compose logs -f backend
docker-compose logs -f db
docker-compose logs -f frontend
```

### Dừng services
```bash
# Stop but keep containers
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove với volumes (xóa database)
docker-compose down -v
```

### Rebuild sau thay đổi code
```bash
# Rebuild backend
docker-compose build backend
docker-compose up -d backend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

### Chạy Prisma commands
```bash
# Prisma migration
docker-compose exec backend npx prisma migrate dev

# Prisma studio
docker-compose exec backend npx prisma studio
```

### Database management
```bash
# Connect to PostgreSQL
docker-compose exec db psql -U unigo_user -d unigo_db

# Backup database
docker-compose exec db pg_dump -U unigo_user -d unigo_db > backup.sql

# Restore database
docker-compose exec -T db psql -U unigo_user -d unigo_db < backup.sql
```

## Troubleshooting

### Port 3000/8080/5432 đã được sử dụng
```bash
# Kiểm tra
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Đổi port trong docker-compose.yml
# Ví dụ: "8000:3000" thay vì "3000:3000"
```

### Database connection timeout
```bash
# Kiểm tra log database
docker-compose logs db

# Đảm bảo "db" service started successfully
docker-compose ps

# Restart database
docker-compose restart db
```

### Rebuild không lấy code mới
```bash
# Xóa cache
docker-compose build --no-cache

# Full clean rebuild
docker-compose down -v
docker-compose build
docker-compose up -d
```

## Network

- Services giao tiếp qua bridge network `unigo_network`
- Backend gọi database: `postgresql://unigo_user:password@db:5432/unigo_db`
- Frontend gọi backend API: `http://backend:3000/api` (internal)
- Client gọi frontend: `http://localhost:8080`
- Client gọi backend: `http://localhost:3000/api`

## Security Notes

⚠️ **PRODUCTION**:
- Thay đổi tất cả default passwords
- Sử dụng Docker secrets thay vì environment variables
- Cấu hình HTTPS/SSL
- Giới hạn resource (memory, CPU)

```yaml
# Ví dụ giới hạn resource
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

## Performance Tips

- Sử dụng `.dockerignore` để exclude node_modules, .git, etc.
- Multi-stage build cho frontend (đã có sẵn)
- Enable BuildKit: `export DOCKER_BUILDKIT=1`
- Sử dụng Alpine images (nhẹ hơn)

## Environment Variables

Xem `.env.example` cho danh sách đầy đủ các biến cần thiết.

**Lưu ý**: Một số biến như `CLOUDINARY_API_KEY` là optional, nhưng cần cho tính năng upload ảnh.
