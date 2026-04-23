const { Op } = require('sequelize');
const { Appointment, Department, Doctor, User } = require('../models');
const { logActivity } = require('../utils/activity');

const INCLUDES = [
  { model: Department, as: 'department', attributes: ['id', 'name', 'slug'] },
  { model: Doctor, as: 'doctor', attributes: ['id', 'name', 'title'] },
  { model: User, as: 'confirmer', attributes: ['id', 'name', 'username'] },
];

// POST /api/appointments/public  (FE website gửi đặt lịch khám)
exports.publicCreate = async (req, res, next) => {
  try {
    const { patientName, patientPhone } = req.body;
    if (!patientName || !patientPhone)
      return res.status(400).json({ message: 'Thiếu tên hoặc SĐT' });

    // Validate đầu vào
    if (patientName.trim().length < 2 || patientName.trim().length > 100) {
      return res.status(400).json({ message: 'Tên bệnh nhân không hợp lệ (2-100 ký tự)' });
    }
    if (!/^[0-9+\s]{8,15}$/.test(patientPhone.trim())) {
      return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
    }

    const data = {
      ...req.body,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      status: 'pending',
    };
    const item = await Appointment.create(data);
    return res.status(201).json({
      message: 'Đăng ký đặt lịch thành công. Chúng tôi sẽ liên hệ sớm nhất.',
      id: item.id,
    });
  } catch (err) { next(err); }
};

// GET /api/appointments (admin)
exports.list = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { search, status, departmentId, doctorId, fromDate, toDate } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { patientName: { [Op.iLike]: `%${search}%` } },
        { patientPhone: { [Op.iLike]: `%${search}%` } },
        { patientEmail: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (status) where.status = status;
    if (departmentId) where.departmentId = departmentId;
    if (doctorId) where.doctorId = doctorId;
    if (fromDate) where.preferredDate = { ...where.preferredDate, [Op.gte]: fromDate };
    if (toDate) where.preferredDate = { ...where.preferredDate, [Op.lte]: toDate };

    const { count, rows } = await Appointment.findAndCountAll({
      where, limit, offset, include: INCLUDES,
      order: [['createdAt', 'DESC']],
    });
    return res.json({
      items: rows, page, limit,
      total: count, totalPages: Math.ceil(count / limit),
    });
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const item = await Appointment.findByPk(req.params.id, { include: INCLUDES });
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    return res.json(item);
  } catch (err) { next(err); }
};

// PATCH /api/appointments/:id  -> cập nhật thông tin
exports.update = async (req, res, next) => {
  try {
    const item = await Appointment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    const allowed = ['doctorId', 'departmentId', 'preferredDate', 'preferredTime', 'adminNote', 'status'];
    allowed.forEach((k) => { if (req.body[k] !== undefined) item[k] = req.body[k]; });

    if (req.body.status === 'confirmed' && !item.confirmedAt) {
      item.confirmedAt = new Date();
      item.confirmedBy = req.user.id;
    }
    await item.save();
    await logActivity(req, {
      action: 'update_appointment', entity: 'appointment', entityId: item.id,
      description: `Cập nhật lịch khám #${item.id} - ${item.status}`,
    });
    return res.json(item);
  } catch (err) { next(err); }
};

// POST /api/appointments/:id/confirm
exports.confirm = async (req, res, next) => {
  try {
    const item = await Appointment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    item.status = 'confirmed';
    item.confirmedAt = new Date();
    item.confirmedBy = req.user.id;
    if (req.body.adminNote) item.adminNote = req.body.adminNote;
    await item.save();
    return res.json(item);
  } catch (err) { next(err); }
};

// POST /api/appointments/:id/cancel
exports.cancel = async (req, res, next) => {
  try {
    const item = await Appointment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    item.status = 'cancelled';
    if (req.body.adminNote) item.adminNote = req.body.adminNote;
    await item.save();
    return res.json(item);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const deleted = await Appointment.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy' });
    return res.status(204).send();
  } catch (err) { next(err); }
};
