# Lien Chieu Admin System — Delivery

Hệ thống quản trị hoàn chỉnh cho website **Trung tâm Y tế Khu vực Liên Chiểu** (`lienchieutestweb`).

## 📁 Cấu trúc package này

```
lienchieu-delivery/
├── backend/                    ← API server (Node + Express + PostgreSQL + Cloudinary)
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── README.md              ← Hướng dẫn deploy backend
│
└── admin-panel-additions/      ← Các file bổ sung vào frontend repo của bạn
    ├── src/
    │   ├── app/router.tsx     (ghi đè)
    │   ├── components/        (mới: admin/*, layout/AdminLayout.tsx)
    │   ├── hooks/             (mới: useAdminResources.ts, useCrud.ts)
    │   ├── lib/api/           (mới: 11 file API client)
    │   └── pages/admin/       (mới: 8+ page admin)
    └── README.md              ← Hướng dẫn tích hợp
```

## 🚀 Quick start

### Bước 1: Chạy backend

```bash
cd backend
npm install
cp .env.example .env
# Sửa các biến môi trường trong .env:
#   - DB_* (PostgreSQL)
#   - CLOUDINARY_* (tạo tài khoản free tại cloudinary.com)
#   - JWT_SECRET (random 32+ ký tự)
npm run db:seed   # tạo bảng + super admin mặc định
npm run dev       # API chạy ở http://localhost:5000
```

Tài khoản mặc định (cấu hình trong `.env`):
- Username: `admin`
- Password: `Admin@123456`

### Bước 2: Tích hợp admin panel vào frontend

```bash
# Copy nội dung admin-panel-additions/src/ vào src/ của repo lienchieutestweb-main
cp -r admin-panel-additions/src/* <duong-dan-repo-frontend>/src/

cd <duong-dan-repo-frontend>

# Cập nhật .env
echo "VITE_API_BASE_URL=http://localhost:5000" > .env
echo "VITE_API_MODE=live" >> .env

npm run dev       # Frontend chạy ở http://localhost:5173
```

Truy cập: `http://localhost:5173/admin/login`

## ✨ Tính năng đã build

### Backend (Node + PostgreSQL + Cloudinary)

- **17 bảng**: User, Menu, Category, Post, Page, Banner, Media, Album, Setting, ActivityLog, Department, Doctor, Service, Drug, Appointment, ContactMessage
- **Auth**: JWT access token + refresh token HttpOnly cookie, rate limit, change password
- **5 role** với permission wildcard: super_admin / admin / editor / author / viewer
- **Upload Cloudinary** ảnh + video
- **Public API** cho frontend website gọi (menu, banner, post, setting...)
- **API contract** khớp 100% với `docs/api-contract.md` trong repo của bạn
- **Activity log** mọi hành động admin
- **Rate limit** bảo vệ login
- **CORS whitelist**, helmet, cookie-parser

### Admin Panel (React + TypeScript + Vite)

Tích hợp vào repo frontend có sẵn, giữ nguyên UI hiện tại (AdminLogin, AdminPostEditor, Analytics), bổ sung:

**Sidebar điều hướng** 5 nhóm, 17 menu:
- **Tổng quan**: Dashboard (số liệu thật từ API), Analytics
- **Nội dung**: Bài viết, Chuyên mục, Trang tĩnh, Menu, Banner, Media Library
- **Bệnh viện**: Khoa phòng, Chuyên gia y tế, Dịch vụ, Tra cứu thuốc
- **Tương tác**: Đặt lịch khám (duyệt lịch), Hộp thư bạn đọc (trả lời)
- **Hệ thống**: Người dùng (phân quyền), Cài đặt (logo/contact/SEO/theme), Nhật ký

**Component dùng chung**:
- `ImageUploader` — drag-drop upload ảnh lên Cloudinary
- `RichTextEditor` — WYSIWYG editor có toolbar + upload ảnh inline
- `DataTable` — bảng với selectable, checkbox, empty/loading state

**Hooks** (React Query):
- `createCrudHooks` — factory
- `useDashboardStats`, `useMenuTree`, `useSettingsGrouped`, và 40+ hooks khác

**API Client** (Axios):
- `common.ts` + factory `createCrudApi`
- 11 modules: auth, posts, menus, categories, pages, banners, media, users, settings, hospital (dept/doctor/service/drug), appointments, dashboard

## 🔑 Chức năng theo yêu cầu ban đầu

| Yêu cầu của bạn | Đã có ở đâu |
|---|---|
| Tạo tài khoản, phân quyền | `/admin/users` — 5 role + custom permissions |
| Thay logo các phần | `/admin/settings` → nhóm "Logo" |
| Thay banner trang chủ | `/admin/banners` |
| Đăng bài theo chủ đề, liên kết menu/submenu | `/admin/posts` + `/admin/categories` + `/admin/menus` |
| Sửa nội dung các trang main/submenu | `/admin/pages` |
| Sửa thông tin liên hệ, thông tin chung | `/admin/settings` |
| Upload ảnh/video thư viện | `/admin/media` |

## 🚢 Deploy production

### Backend
- **Railway** hoặc **Render** + **Supabase/Neon** (PostgreSQL free tier)
- Setup Cloudinary miễn phí tại cloudinary.com (25GB)
- Chạy `npm run db:seed` 1 lần để tạo admin

### Frontend
- **Vercel** (bạn đang dùng rồi)
- Trong Vercel → Environment Variables, thêm:
  - `VITE_API_BASE_URL=https://your-api.com`
  - `VITE_API_MODE=live`

### Lưu ý CORS
Khi deploy, update `ADMIN_URL` và `FRONTEND_URL` trong `.env` của backend thành domain thật để CORS cho phép.

## 📞 Hỗ trợ

Đọc README trong từng thư mục:
- `backend/README.md` — chi tiết backend
- `admin-panel-additions/README.md` — hướng dẫn tích hợp

Chúc bạn deploy thành công! 🚀
