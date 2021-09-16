const express = require('express');
const router = express.Router();
const platController = require('../controllers/platController');
const checkAuthMiddleware = require('../middlewares/checkAuthorization');
const uploadMiddleware = require('../middlewares/uploadMiddleware');


router.get('/', platController.plat_listing);
router.get('/:id', platController.plat_get);
router.post('/', checkAuthMiddleware.checkAuth, uploadMiddleware.upload('image'), platController.plat_post);
router.put('/:id', checkAuthMiddleware.checkAuth, platController.plat_put);
router.delete('/:id', checkAuthMiddleware.checkAuth, platController.plat_delete);

module.exports = router;