const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const checkAuthMiddleware = require('../middlewares/checkAuthorizationMiddleware');

router.get('/', checkAuthMiddleware.checkAuth, orderController.order_listing);
router.get('/:id', checkAuthMiddleware.checkAuth, orderController.order_get);
router.put("/:id", checkAuthMiddleware.checkAuth, orderController.order_put);
router.post('/', checkAuthMiddleware.checkAuth, orderController.order_post);
router.delete('/:id', checkAuthMiddleware.checkAuth, orderController.order_delete);

module.exports = router;
