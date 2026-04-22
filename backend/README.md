# Lien Chieu Admin API

Backend API cho Trung tâm Y tế Khu vực Liên Chiểu — Node.js + Express + PostgreSQL + Cloudinary.

## Yêu cầu

- Node.js 18+
- PostgreSQL 14+ (hoặc tài khoản [Supabase](https://supabase.com) / [Neon](https://neon.tech) / [Railway](https://railway.app) miễn phí)
- Tài khoản [Cloudinary](https://cloudinary.com) miễn phí (25GB)

## Cài đặt local

```bash
cd backend
npm install
cp .env.example .env
# Sửa các biến trong .env (DB, Cloudinary, JWT_SECRET)
npm run db:seed   # tạo schema + super admin mặc định + dữ liệu mẫu
npm run dev       # http://localhost:5000
```

**Tài khoản admin mặc định** (cấu hình trong `.env`):
- Username: `admin`
- Password: `Admin@123456`
- Email: `admin@lienchieu.gov.vn`

⚠️ **Đổi mật khẩu ngay sau lần đăng nhập đầu tiên!**

## Cấu hình `.env`

```env
NODE_ENV=development
PORT=5000

# PostgreSQL local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lienchieu_db
DB_USER=postgres
DB_PASSWORD=your_password

# Hoặc dùng URL (Supabase/Neon/Railway)
# DATABASE_URL=postgresql://user:pass@host:5432/db

JWT_SECRET=<random 32+ ký tự>
JWT_REFRESH_SECRET=<random 32+ ký tự khác>

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

ADMIN_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
```

## Endpoint API chính

| Nhóm | Endpoint | Mô tả |
|---|---|---|
| Auth | `POST /api/auth/login` | Đăng nhập `{usernameOrEmail, password}` |
| Auth | `GET /api/auth/me` | Xem tài khoản hiện tại |
| Auth | `POST /api/auth/refresh` | Làm mới access token |
| Auth | `POST /api/auth/logout` | Đăng xuất |
| Posts | `GET /api/posts` | Danh sách (`?page=1&type=news&status=published`) |
| Posts | `POST /api/posts/:id/publish` | Phát hành bài viết |
| Menus | `GET /api/menus` | Cây menu admin |
| Menus | `GET /api/menus/public` | Cây menu public (FE) |
| Menus | `PATCH /api/menus/reorder` | Sắp xếp kéo thả |
| Uploads | `POST /api/uploads` | Upload file → Cloudinary |
| Banners | `GET /api/banners/public?position=homepage_hero` | Banner cho FE |
| Settings | `GET /api/settings/public` | Toàn bộ setting (logo, liên hệ...) cho FE |
| Departments | CRUD `/api/departments` | Khoa phòng |
| Doctors | CRUD `/api/doctors` | Chuyên gia y tế |
| Services | CRUD `/api/services` | Dịch vụ |
| Drugs | CRUD `/api/drugs` | Thuốc |
| Appointments | `POST /api/appointments/public` | FE gửi đặt lịch |
| Appointments | `POST /api/appointments/:id/confirm` | Admin duyệt lịch |
| Messages | `POST /api/messages/public` | Hộp thư bạn đọc |

**Public endpoint** = không cần token, cho FE website gọi.
**Admin endpoint** = cần header `Authorization: Bearer <token>`.

## Deploy

### Railway (khuyến nghị, free tier)

1. Push code lên GitHub
2. Tạo project Railway → New → Deploy from GitHub
3. Add PostgreSQL plugin (Railway tự inject `DATABASE_URL`)
4. Thêm các biến env còn lại (Cloudinary, JWT)
5. Set `Start Command: npm start`
6. Deploy xong, chạy 1 lần seed trong Railway Console:
   ```
   npm run db:seed
   ```

### Render / Fly.io / VPS

Tương tự: cấu hình env + chạy `npm run db:seed` lần đầu.

## Scripts

- `npm run dev` — chạy dev với nodemon
- `npm start` — chạy production
- `npm run db:sync` — chỉ tạo bảng (không insert data)
- `npm run db:seed` — tạo bảng + super admin + dữ liệu mẫu

## Phân quyền

5 role:
- `super_admin` — toàn quyền (không ai xoá được)
- `admin` — mọi thứ trừ quản lý super_admin
- `editor` — sửa nội dung (posts, pages, menu, media, banners, categories)
- `author` — chỉ bài viết của chính mình
- `viewer` — chỉ xem

Ngoài role, có thể gán **custom permissions** dạng wildcard cho từng user:
- `posts.*` — toàn quyền bài viết
- `menus.update` — chỉ sửa menu
- `*` — toàn quyền (tương đương super_admin)

## Bảo mật

- JWT access token 1 ngày + refresh token HttpOnly cookie 7 ngày
- Rate limit 20 lần đăng nhập sai / 15 phút / IP
- Helmet, CORS whitelist, password bcrypt 10 round
- Toàn bộ hành động admin được log vào `activity_logs`
