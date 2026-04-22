const { Op } = require('sequelize');
const { User } = require('../models');
const { logActivity } = require('../utils/activity');

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { search, role, status } = req.query;

    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where, limit, offset, order: [['createdAt', 'DESC']],
    });
    return res.json({ items: rows, page, limit, total: count, totalPages: Math.ceil(count / limit) });
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy' });
    return res.json(user);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { username, email, password, name, phone, role, permissions, status } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });

    if (role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Không đủ quyền tạo super_admin' });
    }

    const user = await User.create({
      username, email, password, name, phone,
      role: role || 'editor',
      permissions: permissions || [],
      status: status || 'active',
    });
    await logActivity(req, {
      action: 'create_user', entity: 'user', entityId: user.id,
      description: `Tạo tài khoản: ${user.username} (${user.role})`,
    });
    return res.status(201).json(user);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy' });

    if (user.role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Không đủ quyền' });
    }

    const allowed = ['username', 'email', 'name', 'phone', 'avatar', 'avatarPublicId', 'permissions', 'status'];
    allowed.forEach((k) => { if (req.body[k] !== undefined) user[k] = req.body[k]; });
    if (req.body.role !== undefined && req.user.role === 'super_admin') user.role = req.body.role;
    if (req.body.password) user.password = req.body.password;

    await user.save();
    await logActivity(req, {
      action: 'update_user', entity: 'user', entityId: user.id,
      description: `Cập nhật tài khoản: ${user.username}`,
    });
    return res.json(user);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy' });
    if (user.id === req.user.id) return res.status(400).json({ message: 'Không thể xoá chính mình' });
    if (user.role === 'super_admin') return res.status(400).json({ message: 'Không thể xoá super admin' });

    const username = user.username;
    await user.destroy();
    await logActivity(req, {
      action: 'delete_user', entity: 'user', entityId: req.params.id,
      description: `Xoá tài khoản: ${username}`,
    });
    return res.status(204).send();
  } catch (err) { next(err); }
};
