const express = require('express');
const router = express.Router();
const platController = require('../controllers/platController');

router.get('/', platController.plat_listing);
router.get('/:id', platController.plat_get);
router.post('/', platController.plat_post);
router.delete('/:id', platController.plat_delete);

module.exports = router;