const { Op } = require('sequelize');
const { ContactMessage, User } = require('../models');
const { logActivity } = require('../utils/activity');

const INCLUDES = [{ model: User, as: 'replier', attributes: ['id', 'name', 'username'] }];

// POST /api/messages/public  (FE gửi)
exports.publicCreate = async (req, res, next) => {
  try {
    const { senderName, message, type } = req.body;
    if (!senderName || !message) return res.status(400).json({ message: 'Thiếu dữ liệu' });

    // Validate chiều dài
    if (senderName.trim().length < 2 || senderName.trim().length > 100) {
      return res.status(400).json({ message: 'Tên không hợp lệ (2-100 ký tự)' });
    }
    if (message.trim().length < 10 || message.trim().length > 2000) {
      return res.status(400).json({ message: 'Nội dung từ 10 đến 2000 ký tự' });
    }

    const item = await ContactMessage.create({
      ...req.body,
      senderName: senderName.trim(),
      message: message.trim(),
      type: type || 'mailbox',
    });
    return res.status(201).json({ message: 'Gửi thành công. Cảm ơn bạn!', id: item.id });
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { search, status, type } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { senderName: { [Op.iLike]: `%${search}%` } },
        { senderEmail: { [Op.iLike]: `%${search}%` } },
        { subject: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (status) where.status = status;
    if (type) where.type = type;

    const { count, rows } = await ContactMessage.findAndCountAll({
      where, limit, offset, include: INCLUDES,
      order: [['createdAt', 'DESC']],
    });
    return res.json({ items: rows, page, limit, total: count, totalPages: Math.ceil(count / limit) });
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const item = await ContactMessage.findByPk(req.params.id, { include: INCLUDES });
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    return res.json(item);
  } catch (err) { next(err); }
};

// POST /api/messages/:id/reply
exports.reply = async (req, res, next) => {
  try {
    const item = await ContactMessage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    item.adminReply = req.body.reply;
    item.replyAt = new Date();
    item.replyBy = req.user.id;
    item.status = 'replied';
    await item.save();
    await logActivity(req, {
      action: 'reply_message', entity: 'message', entityId: item.id,
      description: `Trả lời hộp thư #${item.id}`,
    });
    return res.json(item);
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const item = await ContactMessage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    if (req.body.status) item.status = req.body.status;
    await item.save();
    return res.json(item);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const deleted = await ContactMessage.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy' });
    return res.status(204).send();
  } catch (err) { next(err); }
};
