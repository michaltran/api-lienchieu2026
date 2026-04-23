require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const { testConnection } = require('./config/database');
const { sequelize, User } = require('./models');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/error');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com', 'https://*.cloudinary.com'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
// Ẩn thông tin server khỏi hẩu (giảm attack surface)
app.disable('x-powered-by');

const corsOrigins = [
  process.env.ADMIN_URL,
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (corsOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      return cb(null, true);
    }
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(cookieParser());
// Giới hạn JSON body 5MB (upload thật sự qua Cloudinary/Multer không qua đây)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Log request: dev mode có màu, production log 'combined' để audit
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.set('trust proxy', 1);

// ==================== Rate Limiting ====================
// Giới hạn chung: 200 request / 15 phút mỗi IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.' },
});

// Giới hạn đăng nhập: 10 lần / 15 phút mỗi IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // chỉ đếm lần thất bại
  message: { success: false, message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.' },
});

// Giới hạn upload: 30 lần / 15 phút
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Giới hạn upload đã đạt. Vui lòng thử lại sau.' },
});

app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/uploads', uploadLimiter);

app.get('/', (req, res) => {
  res.json({
    name: 'Lien Chieu Medical Center Admin API',
    version: '1.1.0',
    status: 'running',
    dbAutoSync: true,
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

(async () => {
  await testConnection();

  // Auto-sync: tạo bảng nếu chưa có
  console.log('🔄 Syncing database schema...');
  await sequelize.sync({ alter: true });
  console.log('✅ Database schema synced');

  // Auto-seed admin nếu chưa có
  const bcrypt = require('bcryptjs');
  const adminCount = await User.count({ where: { role: 'super_admin' } });
  if (adminCount === 0) {
    const adminUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@lienchieu.gov.vn';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123456';
    await User.create({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      name: 'Quản trị hệ thống',
      role: 'super_admin',
      status: 'active',
    });
    console.log(`✅ Auto-created super admin: ${adminUsername}`);
  }

  // Auto-seed default settings nếu chưa có
  const { Setting } = require('./models');
  const DEFAULT_SETTINGS = [
    {
      key: 'hospital.timeline',
      value: JSON.stringify([
        { year: '2010', title: 'Giai đoạn định hình mô hình hoạt động', desc: 'Trung tâm Y tế quận Liên Chiểu được kiện toàn và đi vào hoạt động ổn định.' },
        { year: '2015', title: 'Mở rộng quy mô phục vụ cộng đồng', desc: 'Nâng cấp cơ sở hạ tầng, mở rộng các khoa phòng lâm sàng.' },
        { year: '2018', title: 'Chuẩn hóa quy trình, nâng cao chất lượng', desc: 'Triển khai tiêu chuẩn quản lý chất lượng bệnh viện.' },
        { year: '2020', title: 'Tăng cường năng lực dự phòng & ứng phó dịch', desc: 'Phát huy vai trò nòng cốt trong phòng chống dịch bệnh.' },
        { year: '2023', title: 'Đẩy mạnh chuyển đổi số y tế', desc: 'Ứng dụng CNTT trong quản lý, hướng tới hồ sơ sức khỏe điện tử.' },
        { year: '2025', title: 'Hoàn thiện hệ sinh thái dịch vụ', desc: 'Phát triển các gói dịch vụ y tế chất lượng cao.' },
      ]),
      group: 'hospital',
      type: 'json',
      label: 'Lịch sử hình thành (Timeline)',
      description: 'Danh sách các cột mốc lịch sử. Định dạng JSON: [{year, title, desc}]',
      isPublic: true,
    },
    {
      key: 'hospital.maps',
      value: JSON.stringify([]),
      group: 'hospital',
      type: 'json',
      label: 'Sơ đồ bệnh viện',
      description: 'Danh sách sơ đồ các tầng. Định dạng JSON: [{id, title, level, imageUrl, description}]',
      isPublic: true,
    },
  ];
  for (const setting of DEFAULT_SETTINGS) {
    await Setting.findOrCreate({ where: { key: setting.key }, defaults: setting });
  }
  console.log('✅ Default settings seeded');

  app.listen(PORT, () => {
    console.log(`\n🚀 API server running at http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   Environment:  ${process.env.NODE_ENV || 'development'}\n`);
  });
})();
