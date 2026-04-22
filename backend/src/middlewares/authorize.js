/**
 * Ma trận phân quyền theo role (default)
 * super_admin: toàn quyền
 * admin: mọi thứ trừ quản lý super_admin
 * editor: sửa nội dung (posts, pages, menu, media) - không quản user/settings
 * author: tạo/sửa bài viết của chính mình
 */
const ROLE_PERMISSIONS = {
  super_admin: ['*'],
  admin: [
    'users.view', 'users.create', 'users.update', 'users.delete',
    'menus.*', 'categories.*', 'posts.*', 'pages.*',
    'banners.*', 'media.*', 'albums.*', 'settings.*',
    'logs.view',
  ],
  editor: [
    'menus.*', 'categories.*', 'posts.*', 'pages.*',
    'banners.*', 'media.*', 'albums.*',
  ],
  author: [
    'posts.view', 'posts.create', 'posts.update_own',
    'media.view', 'media.upload',
    'categories.view',
  ],
};

const hasPermission = (user, required) => {
  if (!user) return false;
  const rolePerms = ROLE_PERMISSIONS[user.role] || [];
  const userPerms = Array.isArray(user.permissions) ? user.permissions : [];
  const all = [...rolePerms, ...userPerms];

  // super_admin có wildcard
  if (all.includes('*')) return true;
  if (all.includes(required)) return true;

  // hỗ trợ wildcard group: "posts.*"
  const [group] = required.split('.');
  if (all.includes(`${group}.*`)) return true;

  return false;
};

const authorize = (...requiredPerms) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }
    const ok = requiredPerms.every((p) => hasPermission(user, p));
    if (!ok) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện thao tác này',
      });
    }
    next();
  };
};

// Chỉ cho một vài role nhất định
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Không đủ quyền' });
    }
    next();
  };
};

module.exports = { authorize, requireRole, hasPermission, ROLE_PERMISSIONS };
