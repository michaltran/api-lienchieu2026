const router = require('express').Router();
const c = require('../controllers/contentController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

// ========== CATEGORIES ==========
router.get('/categories/public/tree', c.categoryTree);
router.get('/categories/public', c.category.list);
router.get('/categories/tree', authenticate, c.categoryTree);
router.get('/categories', authenticate, c.category.list);
router.get('/categories/:id', authenticate, c.category.detail);
router.post('/categories', authenticate, authorize('categories.create'), c.category.create);
router.patch('/categories/:id', authenticate, authorize('categories.update'), c.category.update);
router.put('/categories/:id', authenticate, authorize('categories.update'), c.category.update);
router.delete('/categories/:id', authenticate, authorize('categories.delete'), c.category.remove);

// ========== PAGES ==========
router.get('/pages/public/:slug', c.pageBySlug);
router.get('/pages', authenticate, c.page.list);
router.get('/pages/:id', authenticate, c.page.detail);
router.post('/pages', authenticate, authorize('pages.create'), c.page.create);
router.patch('/pages/:id', authenticate, authorize('pages.update'), c.page.update);
router.put('/pages/:id', authenticate, authorize('pages.update'), c.page.update);
router.delete('/pages/:id', authenticate, authorize('pages.delete'), c.page.remove);

// ========== BANNERS ==========
router.get('/banners/public', c.bannerPublic);
router.patch('/banners/reorder', authenticate, authorize('banners.update'), c.bannerReorder);
router.get('/banners', authenticate, c.banner.list);
router.get('/banners/:id', authenticate, c.banner.detail);
router.post('/banners', authenticate, authorize('banners.create'), c.banner.create);
router.patch('/banners/:id', authenticate, authorize('banners.update'), c.banner.update);
router.put('/banners/:id', authenticate, authorize('banners.update'), c.banner.update);
router.delete('/banners/:id', authenticate, authorize('banners.delete'), c.banner.remove);

// ========== ALBUMS ==========
router.get('/albums/public', c.album.list);
router.get('/albums/public/:slug', c.albumBySlug);
router.get('/albums', authenticate, c.album.list);
router.get('/albums/:id', authenticate, c.album.detail);
router.post('/albums', authenticate, authorize('albums.create'), c.album.create);
router.patch('/albums/:id', authenticate, authorize('albums.update'), c.album.update);
router.put('/albums/:id', authenticate, authorize('albums.update'), c.album.update);
router.delete('/albums/:id', authenticate, authorize('albums.delete'), c.album.remove);

// ========== MEDIA ==========
router.get('/media/public', c.publicMediaList);
router.get('/media', authenticate, c.mediaList);
router.delete('/media/bulk', authenticate, authorize('media.delete'), c.mediaBulkDelete);
router.patch('/media/:id', authenticate, authorize('media.update'), c.mediaUpdate);
router.delete('/media/:id', authenticate, authorize('media.delete'), c.mediaDelete);

// ========== SETTINGS ==========
router.get('/settings/public', c.settingPublic);
router.get('/settings/grouped', authenticate, c.settingGrouped);
router.get('/settings', authenticate, c.settingList);
router.post('/settings', authenticate, authorize('settings.create'), c.settingCreate);
router.patch('/settings/bulk', authenticate, authorize('settings.update'), c.settingBulkUpdate);
router.put('/settings/:key', authenticate, authorize('settings.update'), c.settingUpdate);
router.delete('/settings/:key', authenticate, authorize('settings.delete'), c.settingDelete);

module.exports = router;
