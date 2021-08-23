const express = require('express');
const router = express.Router();
const orderPlatController = require('../controllers/orderPlatController');
const checkAuthMiddleware = require('../middlewares/checkAuthorization');

router.get('/test', orderPlatController.test);
router.post('/', orderPlatController.orderplat_post);

module.exports = router;
