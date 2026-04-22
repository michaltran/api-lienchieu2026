const { Op } = require('sequelize');
const { uniqueSlug } = require('./slug');
const { logActivity } = require('./activity');
const { deleteCloudinaryFile } = require('../config/cloudinary');

/**
 * Tạo sẵn các handler CRUD chuẩn cho 1 Model
 * options:
 *   - searchFields: [] - các field tiếng cho search
 *   - slugFromField: 'name' | 'title' - tạo slug từ field
 *   - cloudinaryFields: [{url, publicId, type}] - field ảnh cần xoá khi delete
 *   - filters: {queryKey: modelField} - map query param -> column
 *   - include: [] - Sequelize include
 *   - orderBy: [[col, dir]]
 *   - entityName: 'department' - cho activity log
 */
function makeCrud(Model, options = {}) {
  const {
    searchFields = ['name'],
    slugFromField = 'name',
    cloudinaryFields = [],
    filters = {},
    include = [],
    orderBy = [['orderIndex', 'ASC'], ['id', 'DESC']],
    entityName = 'item',
  } = options;

  return {
    list: async (req, res, next) => {
      try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(200, Math.max(1, parseInt(req.query.limit) || 20));
        const offset = (page - 1) * limit;
        const { search } = req.query;

        const where = {};
        if (search && searchFields.length) {
          where[Op.or] = searchFields.map((f) => ({
            [f]: { [Op.iLike]: `%${search}%` },
          }));
        }
        for (const [qKey, col] of Object.entries(filters)) {
          if (req.query[qKey] !== undefined && req.query[qKey] !== '') {
            const val = req.query[qKey];
            where[col] = val === 'null' ? null : val === 'true' ? true : val === 'false' ? false : val;
          }
        }

        const { count, rows } = await Model.findAndCountAll({
          where, limit, offset, include, order: orderBy,
        });
        return res.json({
          items: rows, page, limit,
          total: count, totalPages: Math.ceil(count / limit),
        });
      } catch (err) { next(err); }
    },

    detail: async (req, res, next) => {
      try {
        const item = await Model.findByPk(req.params.id, { include });
        if (!item) return res.status(404).json({ message: 'Không tìm thấy' });
        return res.json(item);
      } catch (err) { next(err); }
    },

    create: async (req, res, next) => {
      try {
        const data = { ...req.body };
        if (slugFromField && data[slugFromField] && !data.slug) {
          data.slug = await uniqueSlug(Model, data[slugFromField]);
        }
        const item = await Model.create(data);
        await logActivity(req, {
          action: `create_${entityName}`, entity: entityName, entityId: item.id,
          description: `Tạo ${entityName}: ${data[slugFromField] || item.id}`,
        });
        return res.status(201).json(item);
      } catch (err) { next(err); }
    },

    update: async (req, res, next) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Không tìm thấy' });

        // Xoá file Cloudinary cũ nếu có thay đổi
        for (const { url, publicId, type = 'image' } of cloudinaryFields) {
          if (
            req.body[publicId] &&
            req.body[publicId] !== item[publicId] &&
            item[publicId]
          ) {
            await deleteCloudinaryFile(item[publicId], type);
          }
        }

        Object.keys(req.body).forEach((k) => {
          if (k !== 'id') item[k] = req.body[k];
        });

        if (slugFromField && req.body[slugFromField] && req.body[slugFromField] !== item[slugFromField]) {
          item.slug = await uniqueSlug(Model, req.body[slugFromField], item.id);
        }

        await item.save();
        await logActivity(req, {
          action: `update_${entityName}`, entity: entityName, entityId: item.id,
          description: `Cập nhật ${entityName} #${item.id}`,
        });
        return res.json(item);
      } catch (err) { next(err); }
    },

    remove: async (req, res, next) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Không tìm thấy' });

        for (const { publicId, type = 'image' } of cloudinaryFields) {
          if (item[publicId]) await deleteCloudinaryFile(item[publicId], type);
        }
        await item.destroy();
        await logActivity(req, {
          action: `delete_${entityName}`, entity: entityName, entityId: req.params.id,
          description: `Xoá ${entityName} #${req.params.id}`,
        });
        return res.status(204).send();
      } catch (err) { next(err); }
    },
  };
}

module.exports = { makeCrud };
