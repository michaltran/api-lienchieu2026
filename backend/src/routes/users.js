const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

router.use(authenticate);
router.get('/', authorize('users.view'), ctrl.list);
router.get('/:id', authorize('users.view'), ctrl.detail);
router.post('/', authorize('users.create'), ctrl.create);
router.patch('/:id', authorize('users.update'), ctrl.update);
router.put('/:id', authorize('users.update'), ctrl.update);
router.delete('/:id', authorize('users.delete'), ctrl.remove);

module.exports = router;
