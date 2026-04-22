# Hướng dẫn tích hợp Admin Panel vào frontend

Các file trong thư mục này là **BỔ SUNG** vào repo frontend hiện tại của bạn (`lienchieutestweb-main`). 

## Các bước tích hợp

### 1. Copy toàn bộ file vào repo

Copy cấu trúc `src/` trong thư mục này vào `src/` của repo frontend — các file cũ được **giữ nguyên**, chỉ có một số file được **ghi đè** (xem mục 3).

```
src/
├── app/
│   └── router.tsx                 ← GHI ĐÈ
├── components/
│   ├── admin/
│   │   ├── DataTable.tsx          ← MỚI
│   │   ├── ImageUploader.tsx      ← MỚI
│   │   └── RichTextEditor.tsx     ← MỚI
│   └── layout/
│       └── AdminLayout.tsx        ← GHI ĐÈ (có sidebar đầy đủ)
├── hooks/
│   ├── useAdminResources.ts       ← MỚI
│   └── useCrud.ts                 ← MỚI
├── lib/
│   └── api/
│       ├── appointments.ts        ← MỚI
│       ├── banners.ts             ← MỚI
│       ├── categories.ts          ← MỚI
│       ├── common.ts              ← MỚI
│       ├── dashboard.ts           ← MỚI
│       ├── hospital.ts            ← MỚI
│       ├── media.ts               ← MỚI
│       ├── menus.ts               ← MỚI
│       ├── pages.ts               ← MỚI
│       ├── settings.ts            ← MỚI
│       └── users.ts               ← MỚI
└── pages/admin/
    ├── AdminBanners.tsx           ← MỚI
    ├── AdminCrudPages.tsx         ← MỚI (8 page trong 1 file)
    ├── AdminDashboard.tsx         ← MỚI
    ├── AdminMediaLibrary.tsx      ← MỚI
    ├── AdminMenus.tsx             ← MỚI
    ├── AdminSettings.tsx          ← MỚI
    ├── AdminUsers.tsx             ← MỚI
    └── AdminAppointments.tsx      ← MỚI
```

### 2. Cập nhật file `.env`

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_API_MODE=live
```

Khi deploy, đổi `VITE_API_BASE_URL` thành domain API thật (VD: `https://api.lienchieu.gov.vn`).

### 3. Cập nhật API client cũ cho khớp

File `src/lib/api/posts.ts` hiện tại có `coverUrl` nhưng một số nơi dùng `image`. Đảm bảo backend field khớp với type `Post` của bạn. Backend đã được build để khớp 100% với API contract trong `docs/api-contract.md` của bạn.

### 4. Cập nhật `AdminPostEditor.tsx` (tuỳ chọn)

Nếu muốn dùng `RichTextEditor` và `ImageUploader` mới, trong `AdminPostEditor.tsx` thay:
- `<textarea>` nội dung → `<RichTextEditor value={...} onChange={...} />`
- `<input type="file">` cover → `<ImageUploader value={coverUrl} onChange={(url, pid) => setForm({...form, coverUrl: url, coverPublicId: pid})} />`

### 5. Chạy thử

```bash
# Terminal 1: Backend
cd backend
npm install
cp .env.example .env  # sửa env
npm run db:seed        # tạo admin mặc định
npm run dev            # http://localhost:5000

# Terminal 2: Frontend
cd lienchieutestweb-main
npm install
npm run dev            # http://localhost:5173
```

Truy cập: `http://localhost:5173/admin/login`
- Username: `admin`
- Password: `Admin@123456`

## Các menu admin mới

| Menu | Đường dẫn | Chức năng |
|---|---|---|
| Dashboard | `/admin/dashboard` | Tổng quan số liệu |
| Thống kê truy cập | `/admin/analytics` | (giữ nguyên của bạn) |
| Bài viết | `/admin/posts` | (giữ nguyên) |
| Chuyên mục | `/admin/categories` | CRUD chuyên mục |
| Trang tĩnh | `/admin/pages` | CRUD trang (Giới thiệu, Liên hệ...) |
| Menu website | `/admin/menus` | Quản lý menu header/footer/sidebar đa cấp |
| Banner | `/admin/banners` | Slide/banner trang chủ |
| Thư viện Media | `/admin/media` | Upload ảnh/video, quản lý thư viện |
| Khoa phòng | `/admin/departments` | CRUD khoa (3 khối) |
| Chuyên gia y tế | `/admin/doctors` | CRUD bác sĩ |
| Dịch vụ | `/admin/services` | CRUD dịch vụ |
| Tra cứu thuốc | `/admin/drugs` | CRUD thuốc |
| Đặt lịch khám | `/admin/appointments` | Duyệt lịch |
| Hộp thư bạn đọc | `/admin/messages` | Trả lời tin nhắn |
| Người dùng | `/admin/users` | Quản lý tài khoản, phân quyền |
| Cài đặt website | `/admin/settings` | Logo, liên hệ, SEO, theme |
| Nhật ký | `/admin/logs` | Lịch sử hoạt động admin |
