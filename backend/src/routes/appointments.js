const router = require('express').Router();
const ctrl = require('../controllers/appointmentController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');
const rateLimit = require('express-rate-limit');

// Rate limit: mỗi IP chỉ đặt 5 lịch / 15 phút (chống spam)
const publicBookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Bạn đã đặt quá nhiều lịch. Vui lòng thử lại sau 15 phút.' },
});

// PUBLIC: FE gửi đăng ký lịch khám
router.post('/public', publicBookingLimiter, ctrl.publicCreate);

// ADMIN
router.use(authenticate);
router.get('/', authorize('appointments.view'), ctrl.list);
router.get('/:id', authorize('appointments.view'), ctrl.detail);
router.patch('/:id', authorize('appointments.update'), ctrl.update);
router.put('/:id', authorize('appointments.update'), ctrl.update);
router.post('/:id/confirm', authorize('appointments.update'), ctrl.confirm);
router.post('/:id/cancel', authorize('appointments.update'), ctrl.cancel);
router.delete('/:id', authorize('appointments.delete'), ctrl.remove);

module.exports = router;
