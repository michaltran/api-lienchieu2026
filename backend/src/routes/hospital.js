const router = require('express').Router();
const { department, doctor, service, drug } = require('../controllers/hospitalController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

// Helper generate public + admin routes
const makeRoutes = (basePath, ctrl, entity) => {
  // PUBLIC
  router.get(`${basePath}/public`, ctrl.list);
  router.get(`${basePath}/public/:id`, ctrl.detail);

  // ADMIN
  router.use(basePath, authenticate);
  router.get(basePath, ctrl.list);
  router.get(`${basePath}/:id`, ctrl.detail);
  router.post(basePath, authorize(`${entity}.create`), ctrl.create);
  router.patch(`${basePath}/:id`, authorize(`${entity}.update`), ctrl.update);
  router.put(`${basePath}/:id`, authorize(`${entity}.update`), ctrl.update);
  router.delete(`${basePath}/:id`, authorize(`${entity}.delete`), ctrl.remove);
};

makeRoutes('/departments', department, 'departments');
makeRoutes('/doctors', doctor, 'doctors');
makeRoutes('/services', service, 'services');
makeRoutes('/drugs', drug, 'drugs');

module.exports = router;
