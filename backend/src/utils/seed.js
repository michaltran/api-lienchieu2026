require('dotenv').config();
const { sequelize, User, Setting, Menu, Category, Album } = require('../models');

// ========== SETTINGS MẶC ĐỊNH ==========
const DEFAULT_SETTINGS = [
  // Logo
  { group: 'logo', key: 'site_logo', type: 'image', label: 'Logo chính', value: '', orderIndex: 1 },
  { group: 'logo', key: 'site_logo_white', type: 'image', label: 'Logo trắng (dùng ở footer/header tối)', value: '', orderIndex: 2 },
  { group: 'logo', key: 'site_favicon', type: 'image', label: 'Favicon', value: '', orderIndex: 3 },
  { group: 'logo', key: 'site_logo_alt', type: 'text', label: 'Alt text của logo', value: 'Trung tâm Y tế Khu vực Liên Chiểu', orderIndex: 4 },

  // General
  { group: 'general', key: 'site_name', type: 'text', label: 'Tên website', value: 'Trung tâm Y tế Khu vực Liên Chiểu', orderIndex: 1 },
  { group: 'general', key: 'site_slogan', type: 'text', label: 'Khẩu hiệu', value: 'Chăm sóc sức khoẻ người dân tận tâm', orderIndex: 2 },
  { group: 'general', key: 'site_description', type: 'textarea', label: 'Mô tả website', value: 'Cổng thông tin chính thức của Trung tâm Y tế Khu vực Liên Chiểu - Khám chữa bệnh, đặt lịch khám, tra cứu thông tin y tế.', orderIndex: 3 },
  { group: 'general', key: 'site_keywords', type: 'text', label: 'Keywords SEO', value: 'trung tâm y tế, liên chiểu, đà nẵng, khám bệnh, đặt lịch khám', orderIndex: 4 },
  { group: 'general', key: 'hospital_short_name', type: 'text', label: 'Tên viết tắt', value: 'TTYT Liên Chiểu', orderIndex: 5 },

  // Contact
  { group: 'contact', key: 'contact_address', type: 'text', label: 'Địa chỉ', value: 'Quận Liên Chiểu, TP. Đà Nẵng', orderIndex: 1 },
  { group: 'contact', key: 'contact_phone', type: 'text', label: 'Điện thoại', value: '', orderIndex: 2 },
  { group: 'contact', key: 'contact_hotline', type: 'text', label: 'Đường dây nóng cấp cứu', value: '', orderIndex: 3 },
  { group: 'contact', key: 'contact_appointment_phone', type: 'text', label: 'Điện thoại đặt lịch khám', value: '', orderIndex: 4 },
  { group: 'contact', key: 'contact_email', type: 'text', label: 'Email', value: '', orderIndex: 5 },
  { group: 'contact', key: 'contact_working_hours', type: 'text', label: 'Giờ làm việc', value: 'T2-T6: 7h00 - 17h00, T7: 7h00 - 11h30', orderIndex: 6 },
  { group: 'contact', key: 'contact_map_embed', type: 'textarea', label: 'Nhúng Google Map (iframe)', value: '', orderIndex: 7 },
  { group: 'contact', key: 'contact_map_lat', type: 'text', label: 'Latitude', value: '', orderIndex: 8 },
  { group: 'contact', key: 'contact_map_lng', type: 'text', label: 'Longitude', value: '', orderIndex: 9 },

  // Social
  { group: 'social', key: 'social_facebook', type: 'text', label: 'Facebook URL', value: '', orderIndex: 1 },
  { group: 'social', key: 'social_youtube', type: 'text', label: 'YouTube URL', value: '', orderIndex: 2 },
  { group: 'social', key: 'social_zalo', type: 'text', label: 'Zalo OA URL', value: '', orderIndex: 3 },
  { group: 'social', key: 'social_tiktok', type: 'text', label: 'TikTok URL', value: '', orderIndex: 4 },

  // Footer
  { group: 'footer', key: 'footer_copyright', type: 'text', label: 'Nội dung bản quyền', value: '© 2026 Trung tâm Y tế Khu vực Liên Chiểu. All rights reserved.', orderIndex: 1 },
  { group: 'footer', key: 'footer_description', type: 'textarea', label: 'Mô tả footer', value: '', orderIndex: 2 },

  // SEO
  { group: 'seo', key: 'seo_default_title', type: 'text', label: 'Title mặc định', value: 'Trung tâm Y tế Khu vực Liên Chiểu - Đà Nẵng', orderIndex: 1 },
  { group: 'seo', key: 'seo_default_description', type: 'textarea', label: 'Description mặc định', value: '', orderIndex: 2 },
  { group: 'seo', key: 'seo_og_image', type: 'image', label: 'Ảnh OG mặc định', value: '', orderIndex: 3 },
  { group: 'seo', key: 'seo_google_analytics', type: 'text', label: 'Google Analytics ID', value: '', orderIndex: 4 },
  { group: 'seo', key: 'seo_facebook_pixel', type: 'text', label: 'Facebook Pixel ID', value: '', orderIndex: 5 },

  // Appointment
  { group: 'appointment', key: 'appointment_enabled', type: 'boolean', label: 'Cho phép đặt lịch online', value: 'true', orderIndex: 1 },
  { group: 'appointment', key: 'appointment_working_days', type: 'json', label: 'Ngày làm việc', value: '["mon","tue","wed","thu","fri","sat"]', orderIndex: 2 },
  { group: 'appointment', key: 'appointment_time_slots', type: 'json', label: 'Khung giờ (JSON array)', value: '["07:30","08:30","09:30","10:30","13:30","14:30","15:30","16:30"]', orderIndex: 3 },

  // Theme
  { group: 'theme', key: 'theme_primary_color', type: 'color', label: 'Màu chính', value: '#0284c7', orderIndex: 1 },
  { group: 'theme', key: 'theme_secondary_color', type: 'color', label: 'Màu phụ', value: '#10b981', orderIndex: 2 },
];

// ========== CATEGORIES MẪU ==========
const DEFAULT_CATEGORIES = [
  { name: 'Tin tức - Sự kiện', slug: 'tin-tuc-su-kien', orderIndex: 1 },
  { name: 'Y học thường thức', slug: 'y-hoc-thuong-thuc', orderIndex: 2 },
  { name: 'Đào tạo - NCKH', slug: 'dao-tao-nckh', orderIndex: 3 },
  { name: 'Đấu thầu - Mua sắm', slug: 'dau-thau-mua-sam', orderIndex: 4 },
  { name: 'Cải cách hành chính', slug: 'cai-cach-hanh-chinh', orderIndex: 5 },
  { name: 'Khám sức khoẻ', slug: 'kham-suc-khoe', orderIndex: 6 },
  { name: 'Tuyển dụng', slug: 'tuyen-dung', orderIndex: 7 },
  { name: 'Thông báo', slug: 'thong-bao', orderIndex: 8 },
  { name: 'Chính sách', slug: 'chinh-sach', orderIndex: 9 },
];

// ========== MENU MẪU (khớp với nav.ts của frontend) ==========
const DEFAULT_MENUS = [
  {
    name: 'Giới thiệu', url: '/gioi-thieu', position: 'header', orderIndex: 1, type: 'custom',
    children: [
      { name: 'Sứ mệnh - Tầm nhìn', url: '/gioi-thieu/su-menh-tam-nhin', type: 'page' },
      { name: 'Chức năng - Nhiệm vụ', url: '/gioi-thieu/chuc-nang-nhiem-vu', type: 'page' },
      { name: 'Cơ cấu tổ chức', url: '/gioi-thieu/co-cau-to-chuc', type: 'page' },
      { name: 'Sơ đồ bệnh viện', url: '/gioi-thieu/so-do-benh-vien', type: 'page' },
      { name: 'Quá trình hình thành & phát triển', url: '/gioi-thieu/qua-trinh-hinh-thanh-phat-trien', type: 'page' },
    ],
  },
  { name: 'Chuyên khoa', url: '/chuyen-khoa', position: 'header', orderIndex: 2, type: 'custom' },
  { name: 'Chuyên gia y tế', url: '/chuyen-gia-y-te', position: 'header', orderIndex: 3, type: 'custom' },
  {
    name: 'Người bệnh', url: '/nguoi-benh', position: 'header', orderIndex: 4, type: 'custom',
    children: [
      { name: 'Tư vấn tiêm chủng', url: '/nguoi-benh/tu-van-tiem-chung-vac-xin', type: 'page' },
      { name: 'Hướng dẫn quy trình', url: '/nguoi-benh/huong-dan-quy-trinh-kham-chua-benh', type: 'page' },
      { name: 'Bảng giá dịch vụ', url: '/nguoi-benh/bang-gia-dich-vu', type: 'page' },
      { name: 'Chế độ chính sách', url: '/nguoi-benh/che-do-chinh-sach', type: 'page' },
      { name: 'Nhịp cầu nhân ái', url: '/nguoi-benh/nhip-cau-nhan-ai', type: 'page' },
      { name: 'Hộp thư bạn đọc', url: '/nguoi-benh/hop-thu-ban-doc', type: 'page' },
      { name: 'Xem kết quả xét nghiệm', url: '/nguoi-benh/ket-qua-xet-nghiem', type: 'page' },
      { name: 'Xem kết quả chẩn đoán hình ảnh', url: '/nguoi-benh/ket-qua-chan-doan-hinh-anh', type: 'page' },
    ],
  },
  {
    name: 'Hoạt động', url: '/hoat-dong', position: 'header', orderIndex: 5, type: 'custom',
    children: [
      { name: 'Tin tức sự kiện', url: '/hoat-dong/tin-tuc-su-kien', type: 'category' },
      { name: 'Quản lý chất lượng', url: '/hoat-dong/quan-ly-chat-luong', type: 'page' },
      { name: 'Y học thường thức', url: '/hoat-dong/y-hoc-thuong-thuc', type: 'category' },
      { name: 'Đào tạo & NCKH', url: '/hoat-dong/dao-tao-nckh', type: 'category' },
      { name: 'Đấu thầu - Mua sắm', url: '/hoat-dong/dau-thau-mua-sam', type: 'category' },
      { name: 'Cải cách hành chính', url: '/hoat-dong/cai-cach-hanh-chinh', type: 'category' },
      { name: 'Khám sức khoẻ', url: '/hoat-dong/kham-suc-khoe', type: 'category' },
      { name: 'Khảo sát hài lòng', url: '/hoat-dong/khao-sat-hai-long-nguoi-benh', type: 'page' },
      { name: 'Tuyển dụng', url: '/hoat-dong/tuyen-dung', type: 'category' },
    ],
  },
  {
    name: 'Thư viện', url: '/thu-vien', position: 'header', orderIndex: 6, type: 'custom',
    children: [
      { name: 'Video', url: '/thu-vien/video', type: 'custom' },
      { name: 'Hình ảnh', url: '/thu-vien/hinh-anh', type: 'custom' },
      { name: 'Tham quan VR360', url: '/vr360', type: 'custom' },
    ],
  },
  { name: 'Liên hệ', url: '/lien-he', position: 'header', orderIndex: 7, type: 'page' },
];

// ========== ALBUMS MẪU ==========
const DEFAULT_ALBUMS = [
  { name: 'Hoạt động bệnh viện', slug: 'hoat-dong-benh-vien', type: 'image', orderIndex: 1 },
  { name: 'Cơ sở vật chất', slug: 'co-so-vat-chat', type: 'image', orderIndex: 2 },
  { name: 'Video giới thiệu', slug: 'video-gioi-thieu', type: 'video', orderIndex: 3 },
  { name: 'Sự kiện - Hội nghị', slug: 'su-kien-hoi-nghi', type: 'mixed', orderIndex: 4 },
];

const { makeSlug } = require('./slug');

async function seed() {
  try {
    console.log('🔄 Syncing database schema...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced\n');

    // 1. Super admin
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@lienchieu.gov.vn';
    const adminUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123456';

    let admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      admin = await User.create({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        name: 'Quản trị hệ thống',
        role: 'super_admin',
        status: 'active',
      });
      console.log('✅ Đã tạo super admin:');
      console.log(`   Username: ${adminUsername}`);
      console.log(`   Email:    ${adminEmail}`);
      console.log(`   Password: ${adminPassword}\n`);
    } else {
      console.log(`ℹ️  Admin đã tồn tại: ${adminEmail}\n`);
    }

    // 2. Settings
    let newSettings = 0;
    for (const s of DEFAULT_SETTINGS) {
      const [, created] = await Setting.findOrCreate({ where: { key: s.key }, defaults: s });
      if (created) newSettings++;
    }
    console.log(`✅ Settings: tạo mới ${newSettings}/${DEFAULT_SETTINGS.length}`);

    // 3. Categories
    let newCategories = 0;
    for (const c of DEFAULT_CATEGORIES) {
      const [, created] = await Category.findOrCreate({ where: { slug: c.slug }, defaults: c });
      if (created) newCategories++;
    }
    console.log(`✅ Categories: tạo mới ${newCategories}/${DEFAULT_CATEGORIES.length}`);

    // 4. Menus (hỗ trợ children)
    const menuCount = await Menu.count();
    if (menuCount === 0) {
      for (const m of DEFAULT_MENUS) {
        const { children, ...parent } = m;
        parent.slug = makeSlug(parent.name) + '-' + Date.now().toString(36);
        const parentMenu = await Menu.create(parent);
        if (children?.length) {
          for (let i = 0; i < children.length; i++) {
            const c = children[i];
            await Menu.create({
              ...c,
              slug: makeSlug(c.name) + '-' + Date.now().toString(36) + '-' + i,
              parentId: parentMenu.id,
              position: parent.position,
              orderIndex: i + 1,
              type: c.type || 'page',
            });
          }
        }
      }
      console.log(`✅ Menus: tạo mới ${DEFAULT_MENUS.length} menu cha + submenu\n`);
    } else {
      console.log(`ℹ️  Menu đã có ${menuCount} mục, bỏ qua\n`);
    }

    // 5. Albums
    let newAlbums = 0;
    for (const a of DEFAULT_ALBUMS) {
      const [, created] = await Album.findOrCreate({ where: { slug: a.slug }, defaults: a });
      if (created) newAlbums++;
    }
    console.log(`✅ Albums: tạo mới ${newAlbums}/${DEFAULT_ALBUMS.length}\n`);

    console.log('🎉 Seed thành công! Khởi động server với: npm run dev');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
