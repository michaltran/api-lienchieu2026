const router = require('express').Router();
const ctrl = require('../controllers/uploadController');
const { authenticate } = require('../middlewares/auth');
const { uploadMedia } = require('../config/cloudinary');

router.use(authenticate);

// Spec: POST /api/uploads (single file)
router.post('/', uploadMedia.single('file'), ctrl.upload);

// Bonus: upload nhiều file
router.post('/multiple', uploadMedia.array('files', 20), ctrl.uploadMultiple);

// Spec: DELETE /api/uploads/:id
router.delete('/:id', ctrl.remove);

module.exports = router;
