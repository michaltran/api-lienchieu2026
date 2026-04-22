const router = require('express').Router();
const ctrl = require('../controllers/menuController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

// PUBLIC
router.get('/public', ctrl.tree);

// ADMIN
router.use(authenticate);
router.get('/', ctrl.tree);
router.get('/flat', ctrl.list);
router.patch('/reorder', authorize('menus.update'), ctrl.reorder);
router.get('/:id', ctrl.detail);
router.post('/', authorize('menus.create'), ctrl.create);
router.patch('/:id', authorize('menus.update'), ctrl.update);
router.put('/:id', authorize('menus.update'), ctrl.update);
router.delete('/:id', authorize('menus.delete'), ctrl.remove);

module.exports = router;
