const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.order_listing);
router.get('/:id', orderController.order_get);
router.post('/', orderController.order_post);
router.delete('/:id', orderController.order_delete);

module.exports = router;
