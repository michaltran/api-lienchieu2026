const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');
const { logActivity } = require('../utils/activity');

const generateTokens = (user) => {
  const payload = { id: user.id, username: user.username, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return { accessToken, refreshToken };
};

// POST /api/auth/login
// Body: { usernameOrEmail, password }
// Response: { accessToken, user }
exports.login = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: 'Thiếu tài khoản hoặc mật khẩu' });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      },
    });
    if (!user) {
      await logActivity(req, {
        action: 'login_failed', entity: 'user', entityId: null,
        description: `Đăng nhập thất bại: tài khoản không tồn tại (${usernameOrEmail})`,
      });
      return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    }
    if (user.status !== 'active') {
      await logActivity(req, {
        action: 'login_failed', entity: 'user', entityId: user.id,
        description: `Đăng nhập thất bại: tài khoản bị khoá (${user.username})`,
      });
      return res.status(403).json({ message: 'Tài khoản đã bị khoá' });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      await logActivity(req, {
        action: 'login_failed', entity: 'user', entityId: user.id,
        description: `Đăng nhập thất bại: sai mật khẩu (${user.username})`,
      });
      return res.status(401).json({ message: 'Mật khẩu không đúng' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.lastLogin = new Date();
    user.lastLoginIp = req.ip;
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await logActivity(req, {
      action: 'login', entity: 'user', entityId: user.id,
      description: `Đăng nhập: ${user.username}`,
    });

    return res.json({
      accessToken,
      user: user.toJSON(),
    });
  } catch (err) { next(err); }
};

// POST /api/auth/refresh -> { accessToken }
exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Thiếu refresh token' });

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: 'Refresh token không hợp lệ' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Refresh token không hợp lệ' });
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken: tokens.accessToken });
  } catch (err) { next(err); }
};

// POST /api/auth/logout -> 204
exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      req.user.refreshToken = null;
      await req.user.save();
      await logActivity(req, {
        action: 'logout', entity: 'user', entityId: req.user.id,
        description: `Đăng xuất: ${req.user.username}`,
      });
    }
    res.clearCookie('refreshToken');
    return res.status(204).send();
  } catch (err) { next(err); }
};

// GET /api/auth/me -> User object
exports.me = async (req, res) => {
  return res.json(req.user.toJSON());
};

// PATCH /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar, avatarPublicId } = req.body;
    const user = req.user;
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (avatarPublicId !== undefined) user.avatarPublicId = avatarPublicId;
    await user.save();
    return res.json(user.toJSON());
  } catch (err) { next(err); }
};

// POST /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Thiếu dữ liệu' });
    if (newPassword.length < 8) return res.status(400).json({ message: 'Mật khẩu mới tối thiểu 8 ký tự' });
    if (!/(?=.*[A-Z])(?=.*[0-9])/.test(newPassword)) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 1 chữ hoa và 1 số' });
    }

    const ok = await req.user.comparePassword(oldPassword);
    if (!ok) return res.status(401).json({ message: 'Mật khẩu cũ không đúng' });

    req.user.password = newPassword;
    await req.user.save();
    return res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) { next(err); }
};
