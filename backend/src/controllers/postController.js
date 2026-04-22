const { Op } = require('sequelize');
const { Post, Category, User } = require('../models');
const { uniqueSlug } = require('../utils/slug');
const { logActivity } = require('../utils/activity');
const { deleteCloudinaryFile } = require('../config/cloudinary');

const INCLUDES = [
  { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
  { model: User, as: 'author', attributes: ['id', 'name', 'username', 'avatar'] },
];

// GET /api/posts
// Response: { items, page, limit, total, totalPages }
exports.list = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const { search, type, status, tag, categoryId, isFeatured } = req.query;
    const where = {};
    if (search) where.title = { [Op.iLike]: `%${search}%` };
    if (type) where.type = type;
    if (status) where.status = status;
    if (tag) where.tags = { [Op.contains]: [tag] };
    if (categoryId) where.categoryId = categoryId;
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

    // Author chỉ xem được bài của mình
    if (req.user?.role === 'author') where.authorId = req.user.id;

    const { count, rows } = await Post.findAndCountAll({
      where, limit, offset,
      include: INCLUDES,
      order: [['isPinned', 'DESC'], ['publishedAt', 'DESC'], ['createdAt', 'DESC']],
    });

    return res.json({
      items: rows,
      page, limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) { next(err); }
};

// GET /api/posts/:id
exports.detail = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id, { include: INCLUDES });
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    if (req.user?.role === 'author' && post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Không đủ quyền' });
    }
    return res.json(post);
  } catch (err) { next(err); }
};

// POST /api/posts
exports.create = async (req, res, next) => {
  try {
    const { title, excerpt, content, coverUrl, coverPublicId, type, categoryId, status, isFeatured, isPinned, tags, seoTitle, seoDescription, publishedAt } = req.body;
    if (!title) return res.status(400).json({ message: 'Thiếu tiêu đề' });

    const slug = await uniqueSlug(Post, title);
    const post = await Post.create({
      title, slug, excerpt, content,
      coverUrl, coverPublicId,
      type: type || 'news',
      categoryId: categoryId || null,
      authorId: req.user.id,
      status: status || 'draft',
      isFeatured: !!isFeatured,
      isPinned: !!isPinned,
      tags: tags || [],
      seoTitle, seoDescription,
      publishedAt: publishedAt || (status === 'published' ? new Date() : null),
    });
    const full = await Post.findByPk(post.id, { include: INCLUDES });
    await logActivity(req, { action: 'create_post', entity: 'post', entityId: post.id, description: `Tạo bài viết: ${title}` });
    return res.status(201).json(full);
  } catch (err) { next(err); }
};

// PUT /api/posts/:id (contract FE dùng PUT)
exports.update = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    if (req.user.role === 'author' && post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Không đủ quyền' });
    }

    if (req.body.coverPublicId && req.body.coverPublicId !== post.coverPublicId && post.coverPublicId) {
      await deleteCloudinaryFile(post.coverPublicId, 'image');
    }

    const allowed = ['title', 'excerpt', 'content', 'coverUrl', 'coverPublicId', 'type', 'categoryId', 'status', 'isFeatured', 'isPinned', 'tags', 'seoTitle', 'seoDescription'];
    allowed.forEach((k) => { if (req.body[k] !== undefined) post[k] = req.body[k]; });

    if (req.body.title && req.body.title !== post.title) {
      post.slug = await uniqueSlug(Post, req.body.title, post.id);
    }
    if (req.body.status === 'published' && !post.publishedAt) post.publishedAt = new Date();

    await post.save();
    const full = await Post.findByPk(post.id, { include: INCLUDES });
    await logActivity(req, { action: 'update_post', entity: 'post', entityId: post.id, description: `Cập nhật: ${post.title}` });
    return res.json(full);
  } catch (err) { next(err); }
};

// DELETE /api/posts/:id -> 204
exports.remove = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    if (req.user.role === 'author' && post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Không đủ quyền' });
    }
    if (post.coverPublicId) await deleteCloudinaryFile(post.coverPublicId, 'image');
    const title = post.title;
    await post.destroy();
    await logActivity(req, { action: 'delete_post', entity: 'post', entityId: req.params.id, description: `Xoá: ${title}` });
    return res.status(204).send();
  } catch (err) { next(err); }
};

// POST /api/posts/:id/publish
exports.publish = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    post.status = 'published';
    post.publishedAt = post.publishedAt || new Date();
    await post.save();
    const full = await Post.findByPk(post.id, { include: INCLUDES });
    await logActivity(req, { action: 'publish_post', entity: 'post', entityId: post.id, description: `Phát hành: ${post.title}` });
    return res.json(full);
  } catch (err) { next(err); }
};

// POST /api/posts/:id/unpublish
exports.unpublish = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    post.status = 'draft';
    await post.save();
    const full = await Post.findByPk(post.id, { include: INCLUDES });
    await logActivity(req, { action: 'unpublish_post', entity: 'post', entityId: post.id, description: `Thu hồi: ${post.title}` });
    return res.json(full);
  } catch (err) { next(err); }
};

// Bulk action (giữ nguyên như cũ nhưng trả JSON thường)
exports.bulkAction = async (req, res, next) => {
  try {
    const { ids, action } = req.body;
    if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: 'Thiếu ids' });

    if (action === 'delete') {
      const posts = await Post.findAll({ where: { id: ids } });
      for (const p of posts) {
        if (p.coverPublicId) await deleteCloudinaryFile(p.coverPublicId, 'image');
      }
      await Post.destroy({ where: { id: ids } });
    } else if (['publish', 'draft', 'archive'].includes(action)) {
      const statusMap = { publish: 'published', draft: 'draft', archive: 'archived' };
      const update = { status: statusMap[action] };
      if (action === 'publish') update.publishedAt = new Date();
      await Post.update(update, { where: { id: ids } });
    } else {
      return res.status(400).json({ message: 'Action không hợp lệ' });
    }

    await logActivity(req, { action: `bulk_${action}_post`, entity: 'post', description: `${action} ${ids.length} bài` });
    return res.json({ affected: ids.length });
  } catch (err) { next(err); }
};

// ====== PUBLIC (FE website gọi) ======
exports.publicList = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;
    const { search, type, tag, categoryId, categorySlug, isFeatured } = req.query;

    const where = { status: 'published' };
    if (search) where.title = { [Op.iLike]: `%${search}%` };
    if (type) where.type = type;
    if (tag) where.tags = { [Op.contains]: [tag] };
    if (categoryId) where.categoryId = categoryId;
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

    const include = [
      { model: User, as: 'author', attributes: ['id', 'name', 'avatar'] },
      {
        model: Category, as: 'category', attributes: ['id', 'name', 'slug'],
        ...(categorySlug && { where: { slug: categorySlug } }),
      },
    ];

    const { count, rows } = await Post.findAndCountAll({
      where, include, limit, offset,
      order: [['isPinned', 'DESC'], ['publishedAt', 'DESC']],
    });

    return res.json({
      items: rows, page, limit,
      total: count, totalPages: Math.ceil(count / limit),
    });
  } catch (err) { next(err); }
};

exports.publicBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { slug: req.params.slug, status: 'published' },
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      ],
    });
    if (!post) return res.status(404).json({ message: 'Không tìm thấy' });
    post.views = (post.views || 0) + 1;
    await post.save();
    return res.json(post);
  } catch (err) { next(err); }
};
