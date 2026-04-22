const router = require('express').Router();
const ctrl = require('../controllers/logController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

router.use(authenticate);
router.get('/logs', authorize('logs.view'), ctrl.logs);
router.get('/dashboard/stats', ctrl.stats);

module.exports = router;
