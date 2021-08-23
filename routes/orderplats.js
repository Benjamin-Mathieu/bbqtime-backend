const express = require('express');
const router = express.Router();
const orderPlatController = require('../controllers/orderPlatController');
const checkAuthMiddleware = require('../middlewares/checkAuthorization');

router.get('/', checkAuthMiddleware.checkAuth, orderPlatController.orderplats_listing);
router.post('/', checkAuthMiddleware.checkAuth, orderPlatController.orderplats_post);

module.exports = router;
