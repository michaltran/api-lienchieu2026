const { Category, Page, Banner, Setting, Album, Media, User } = require('../models');
const { makeCrud } = require('../utils/crud');
const { uniqueSlug } = require('../utils/slug');
const { logActivity } = require('../utils/activity');
const { deleteCloudinaryFile } = require('../config/cloudinary');

// ============= CATEGORIES (đa cấp) =============
const buildCatTree = (items, parentId = null) =>
  items
    .filter((i) => i.parentId === parentId)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((i) => ({ ...i.toJSON(), children: buildCatTree(items, i.id) }));

exports.categoryTree = async (req, res, next) => {
  try {
    const items = await Category.findAll({ order: [['orderIndex', 'ASC']] });
    return res.json(buildCatTree(items, null));
  } catch (err) { next(err); }
};

exports.category = makeCrud(Category, {
  searchFields: ['name', 'description'],
  slugFromField: 'name',
  cloudinaryFields: [{ publicId: 'thumbnailPublicId', type: 'image' }],
  filters: { parentId: 'parentId', isActive: 'isActive' },
  entityName: 'category',
});

// ============= PAGES =============
exports.page = makeCrud(Page, {
  searchFields: ['title'],
  slugFromField: 'title',
  cloudinaryFields: [{ publicId: 'thumbnailPublicId', type: 'image' }],
  filters: { template: 'template', status: 'status' },
  entityName: 'page',
});

exports.pageBySlug = async (req, res, next) => {
  try {
    const item = await Page.findOne({
      where: { slug: req.params.slug, status: 'published' },
    });
    if (!item) return res.status(404).json({ message: 'Không tìm thấy trang' });
    return res.json(item);
  } catch (err) { next(err); }
};

// ============= BANNERS =============
exports.banner = makeCrud(Banner, {
  searchFields: ['title', 'subtitle'],
  slugFromField: null,
  cloudinaryFields: [
    { publicId: 'imagePublicId', type: 'image' },
    { publicId: 'mobileImagePublicId', type: 'image' },
  ],
  filters: { position: 'position', isActive: 'isActive' },
  orderBy: [['position', 'ASC'], ['orderIndex', 'ASC']],
  entityName: 'banner',
});

exports.bannerReorder = async (req, res, next) => {
  try {
    const updates = req.body.items || [];
    await Promise.all(updates.map((u) =>
      Banner.update({ orderIndex: u.orderIndex }, { where: { id: u.id } })
    ));
    return res.json({ message: 'Đã cập nhật thứ tự' });
  } catch (err) { next(err); }
};

exports.bannerPublic = async (req, res, next) => {
  try {
    const { Op } = require('sequelize');
    const { position } = req.query;
    const where = { isActive: true };
    if (position) where.position = position;
    const now = new Date();
    where[Op.and] = [
      { [Op.or]: [{ startDate: null }, { startDate: { [Op.lte]: now } }] },
      { [Op.or]: [{ endDate: null }, { endDate: { [Op.gte]: now } }] },
    ];
    const items = await Banner.findAll({ where, order: [['orderIndex', 'ASC']] });
    return res.json(items);
  } catch (err) { next(err); }
};

// ============= ALBUMS =============
exports.album = makeCrud(Album, {
  searchFields: ['name', 'description'],
  slugFromField: 'name',
  filters: { type: 'type', isActive: 'isActive' },
  entityName: 'album',
});

exports.albumBySlug = async (req, res, next) => {
  try {
    const item = await Album.findOne({
      where: { slug: req.params.slug, isActive: true },
      include: [{ model: Media, as: 'items' }],
    });
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    return res.json(item);
  } catch (err) { next(err); }
};

// ============= MEDIA =============
exports.mediaList = async (req, res, next) => {
  try {
    const { Op } = require('sequelize');
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 30));
    const offset = (page - 1) * limit;
    const { search, type, albumId } = req.query;

    const where = {};
    if (type) where.type = type;
    if (albumId !== undefined) where.albumId = albumId === 'null' ? null : albumId;
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    const { count, rows } = await Media.findAndCountAll({
      where, limit, offset,
      include: [
        { model: Album, as: 'album', attributes: ['id', 'name', 'slug'] },
        { model: User, as: 'uploader', attributes: ['id', 'name', 'username'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.json({ items: rows, page, limit, total: count, totalPages: Math.ceil(count / limit) });
  } catch (err) { next(err); }
};

exports.mediaUpdate = async (req, res, next) => {
  try {
    const item = await Media.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    const allowed = ['title', 'description', 'albumId', 'tags'];
    allowed.forEach((k) => { if (req.body[k] !== undefined) item[k] = req.body[k]; });
    await item.save();
    return res.json(item);
  } catch (err) { next(err); }
};

exports.mediaDelete = async (req, res, next) => {
  try {
    const item = await Media.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    if (item.publicId) await deleteCloudinaryFile(item.publicId, item.type);
    await item.destroy();
    return res.status(204).send();
  } catch (err) { next(err); }
};

exports.mediaBulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: 'Thiếu ids' });
    const items = await Media.findAll({ where: { id: ids } });
    for (const it of items) {
      if (it.publicId) await deleteCloudinaryFile(it.publicId, it.type);
    }
    await Media.destroy({ where: { id: ids } });
    return res.json({ count: items.length });
  } catch (err) { next(err); }
};

// ============= SETTINGS =============
exports.settingList = async (req, res, next) => {
  try {
    const { group } = req.query;
    const where = {};
    if (group) where.group = group;
    const items = await Setting.findAll({ where, order: [['group', 'ASC'], ['orderIndex', 'ASC']] });
    return res.json(items);
  } catch (err) { next(err); }
};

exports.settingGrouped = async (req, res, next) => {
  try {
    const items = await Setting.findAll({ order: [['group', 'ASC'], ['orderIndex', 'ASC']] });
    const grouped = {};
    items.forEach((i) => {
      if (!grouped[i.group]) grouped[i.group] = [];
      grouped[i.group].push(i);
    });
    return res.json(grouped);
  } catch (err) { next(err); }
};

exports.settingPublic = async (req, res, next) => {
  try {
    const items = await Setting.findAll();
    const data = {};
    items.forEach((i) => {
      let value = i.value;
      if (i.type === 'boolean') value = value === 'true';
      if (i.type === 'number') value = Number(value);
      if (i.type === 'json' && value) { try { value = JSON.parse(value); } catch {} }
      data[i.key] = value;
    });
    return res.json(data);
  } catch (err) { next(err); }
};

exports.settingUpdate = async (req, res, next) => {
  try {
    const item = await Setting.findOne({ where: { key: req.params.key } });
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    const { value } = req.body;
    item.value = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
    await item.save();
    await logActivity(req, {
      action: 'update_setting', entity: 'setting', entityId: item.id,
      description: `Cập nhật: ${req.params.key}`,
    });
    return res.json(item);
  } catch (err) { next(err); }
};

exports.settingBulkUpdate = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: 'Sai dữ liệu' });
    for (const it of items) {
      await Setting.update(
        { value: typeof it.value === 'object' ? JSON.stringify(it.value) : String(it.value ?? '') },
        { where: { key: it.key } }
      );
    }
    return res.json({ message: 'Đã lưu', count: items.length });
  } catch (err) { next(err); }
};

exports.settingCreate = async (req, res, next) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ message: 'Thiếu key' });
    const exist = await Setting.findOne({ where: { key } });
    if (exist) return res.status(400).json({ message: 'Key đã tồn tại' });
    const item = await Setting.create({ ...req.body, type: req.body.type || 'text', group: req.body.group || 'general' });
    return res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.settingDelete = async (req, res, next) => {
  try {
    const deleted = await Setting.destroy({ where: { key: req.params.key } });
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy' });
    return res.status(204).send();
  } catch (err) { next(err); }
};
