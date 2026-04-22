const { Menu } = require('../models');
const { uniqueSlug } = require('../utils/slug');
const { logActivity } = require('../utils/activity');

const buildTree = (items, parentId = null) =>
  items
    .filter((i) => i.parentId === parentId)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((i) => ({ ...i.toJSON(), children: buildTree(items, i.id) }));

exports.tree = async (req, res, next) => {
  try {
    const { position } = req.query;
    const where = {};
    if (position) where.position = position;
    const items = await Menu.findAll({ where, order: [['orderIndex', 'ASC']] });
    return res.json(buildTree(items, null));
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const items = await Menu.findAll({ order: [['position', 'ASC'], ['orderIndex', 'ASC']] });
    return res.json(items);
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const item = await Menu.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    return res.json(item);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Thiếu tên menu' });
    const slug = await uniqueSlug(Menu, name);
    const item = await Menu.create({
      ...req.body, slug,
      position: req.body.position || 'header',
      type: req.body.type || 'page',
    });
    await logActivity(req, {
      action: 'create_menu', entity: 'menu', entityId: item.id,
      description: `Tạo menu: ${item.name}`,
    });
    return res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Menu.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });

    Object.keys(req.body).forEach((k) => {
      if (k !== 'id' && k !== 'slug') item[k] = req.body[k];
    });
    if (req.body.name && req.body.name !== item.name) {
      item.slug = await uniqueSlug(Menu, req.body.name, item.id);
    }
    await item.save();
    return res.json(item);
  } catch (err) { next(err); }
};

// PATCH /api/menus/reorder { items: [{id, parentId, orderIndex}, ...] }
exports.reorder = async (req, res, next) => {
  try {
    const updates = req.body.items || [];
    if (!Array.isArray(updates)) return res.status(400).json({ message: 'Dữ liệu sai' });
    await Promise.all(updates.map((u) =>
      Menu.update(
        { parentId: u.parentId || null, orderIndex: u.orderIndex || 0 },
        { where: { id: u.id } }
      )
    ));
    return res.json({ message: 'Đã cập nhật thứ tự' });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Menu.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
    const name = item.name;
    await item.destroy();
    await logActivity(req, { action: 'delete_menu', entity: 'menu', entityId: req.params.id, description: `Xoá menu: ${name}` });
    return res.status(204).send();
  } catch (err) { next(err); }
};
