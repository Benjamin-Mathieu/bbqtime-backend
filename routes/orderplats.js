const express = require('express');
const router = express.Router();
const orderPlatController = require('../controllers/orderPlatController');
const checkAuthMiddleware = require('../middlewares/checkAuthorization');

router.get('/', orderPlatController.orderplats_listing);
router.post('/', orderPlatController.orderplats_post);

module.exports = router;
