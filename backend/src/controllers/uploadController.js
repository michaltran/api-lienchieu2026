const { Media } = require('../models');
const { deleteCloudinaryFile } = require('../config/cloudinary');
const { logActivity } = require('../utils/activity');

// POST /api/uploads
// Response: { id, url, filename, mimetype, size }
exports.upload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Không có file' });

    const isVideo = req.file.mimetype?.startsWith('video/');
    // Lưu luôn vào Media library để có id (spec FE cần id để delete)
    const media = await Media.create({
      title: req.file.originalname,
      type: isVideo ? 'video' : 'image',
      url: req.file.path,
      publicId: req.file.filename,
      format: req.file.format,
      size: req.file.size,
      width: req.file.width,
      height: req.file.height,
      duration: req.file.duration,
      uploadedBy: req.user?.id,
    });

    await logActivity(req, {
      action: 'upload_file', entity: 'media', entityId: media.id,
      description: `Upload: ${req.file.originalname}`,
    });

    return res.status(201).json({
      id: String(media.id),
      url: media.url,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: media.size,
      publicId: media.publicId,
    });
  } catch (err) { next(err); }
};

// POST /api/uploads/multiple - nhiều file (bonus)
exports.uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files?.length) return res.status(400).json({ message: 'Không có file' });
    const { albumId } = req.body;
    const items = [];
    for (const f of req.files) {
      const isVideo = f.mimetype?.startsWith('video/');
      const m = await Media.create({
        title: f.originalname,
        type: isVideo ? 'video' : 'image',
        url: f.path, publicId: f.filename,
        format: f.format, size: f.size,
        width: f.width, height: f.height, duration: f.duration,
        albumId: albumId || null,
        uploadedBy: req.user?.id,
      });
      items.push({
        id: String(m.id),
        url: m.url,
        filename: f.originalname,
        mimetype: f.mimetype,
        size: m.size,
        publicId: m.publicId,
      });
    }
    return res.status(201).json(items);
  } catch (err) { next(err); }
};

// DELETE /api/uploads/:id -> 204
exports.remove = async (req, res, next) => {
  try {
    const m = await Media.findByPk(req.params.id);
    if (!m) return res.status(404).json({ message: 'Không tìm thấy' });
    if (m.publicId) await deleteCloudinaryFile(m.publicId, m.type);
    await m.destroy();
    return res.status(204).send();
  } catch (err) { next(err); }
};
