const express = require('express');
const router = express.Router();
const platController = require('../controllers/platController');

router.get('/', platController.plat_listing);

module.exports = router;