const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/menus', require('./menus'));
router.use('/uploads', require('./uploads'));
router.use('/appointments', require('./appointments'));
router.use('/messages', require('./messages'));
router.use('/', require('./content'));   // categories, pages, banners, albums, media, settings
router.use('/', require('./hospital'));  // departments, doctors, services, drugs
router.use('/', require('./system'));    // logs + dashboard/stats

// Healthcheck
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running', time: new Date() });
});

module.exports = router;
