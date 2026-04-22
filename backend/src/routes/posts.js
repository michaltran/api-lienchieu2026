const router = require('express').Router();
const ctrl = require('../controllers/postController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

// ====== PUBLIC ======
router.get('/public', ctrl.publicList);
router.get('/public/:slug', ctrl.publicBySlug);

// ====== ADMIN ======
router.use(authenticate);
router.get('/', ctrl.list);
router.post('/', authorize('posts.create'), ctrl.create);
router.post('/bulk-action', authorize('posts.update'), ctrl.bulkAction);
router.get('/:id', ctrl.detail);
router.put('/:id', ctrl.update); // contract FE dùng PUT
router.patch('/:id', ctrl.update); // hỗ trợ cả PATCH
router.delete('/:id', ctrl.remove);
router.post('/:id/publish', authorize('posts.publish'), ctrl.publish);
router.post('/:id/unpublish', authorize('posts.publish'), ctrl.unpublish);

module.exports = router;
