const router = require('express').Router();
const ctrl = require('../controllers/messageController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

router.post('/public', ctrl.publicCreate);

router.use(authenticate);
router.get('/', authorize('messages.view'), ctrl.list);
router.get('/:id', authorize('messages.view'), ctrl.detail);
router.post('/:id/reply', authorize('messages.reply'), ctrl.reply);
router.patch('/:id', authorize('messages.update'), ctrl.updateStatus);
router.delete('/:id', authorize('messages.delete'), ctrl.remove);

module.exports = router;
