const { ActivityLog, User, Post, Page, Menu, Banner, Media, Category, Department, Doctor, Appointment, ContactMessage } = require('../models');

exports.logs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 30));
    const offset = (page - 1) * limit;
    const { userId, action, entity } = req.query;
    const where = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entity) where.entity = entity;

    const { count, rows } = await ActivityLog.findAndCountAll({
      where, limit, offset,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']],
    });
    return res.json({ items: rows, page, limit, total: count, totalPages: Math.ceil(count / limit) });
  } catch (err) { next(err); }
};

exports.stats = async (req, res, next) => {
  try {
    const [
      posts, pages, menus, banners, media, users, categories,
      departments, doctors, appointments, messages,
    ] = await Promise.all([
      Post.count(), Page.count(), Menu.count(), Banner.count(),
      Media.count(), User.count(), Category.count(),
      Department.count(), Doctor.count(), Appointment.count(), ContactMessage.count(),
    ]);

    const [publishedPosts, draftPosts, pendingAppointments, newMessages] = await Promise.all([
      Post.count({ where: { status: 'published' } }),
      Post.count({ where: { status: 'draft' } }),
      Appointment.count({ where: { status: 'pending' } }),
      ContactMessage.count({ where: { status: 'new' } }),
    ]);

    const recentPosts = await Post.findAll({
      limit: 5, order: [['createdAt', 'DESC']],
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'name', 'username'] },
      ],
    });

    const recentAppointments = await Appointment.findAll({
      limit: 5, order: [['createdAt', 'DESC']],
    });

    const recentLogs = await ActivityLog.findAll({
      limit: 10, order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'username'] }],
    });

    return res.json({
      counts: { posts, pages, menus, banners, media, users, categories, departments, doctors, appointments, messages },
      posts: { published: publishedPosts, draft: draftPosts },
      appointments: { pending: pendingAppointments },
      messages: { new: newMessages },
      recentPosts, recentAppointments, recentLogs,
    });
  } catch (err) { next(err); }
};
