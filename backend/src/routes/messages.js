const router = require('express').Router();
const ctrl = require('../controllers/messageController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');
const rateLimit = require('express-rate-limit');

// Rate limit: 3 tin nhắn / 15 phút mỗi IP (chống spam)
const publicMessageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Bạn gửi quá nhiều tin nhắn. Vui lòng thử lại sau 15 phút.' },
});

router.post('/public', publicMessageLimiter, ctrl.publicCreate);

router.use(authenticate);
router.get('/', authorize('messages.view'), ctrl.list);
router.get('/:id', authorize('messages.view'), ctrl.detail);
router.post('/:id/reply', authorize('messages.reply'), ctrl.reply);
router.patch('/:id', authorize('messages.update'), ctrl.updateStatus);
router.delete('/:id', authorize('messages.delete'), ctrl.remove);

module.exports = router;
