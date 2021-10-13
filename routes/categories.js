const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');
const checkAuthMiddleware = require('../middlewares/checkAuthorizationMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');


router.get('/:id', categorieController.categorie_listing);
router.post('/', checkAuthMiddleware.checkAuth, uploadMiddleware.upload('image'), categorieController.categorie_post);
router.put('/update', checkAuthMiddleware.checkAuth, uploadMiddleware.upload('image'), categorieController.categorie_put);
router.delete('/delete', checkAuthMiddleware.checkAuth, categorieController.categorie_delete);

module.exports = router;
