const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');
const checkAuthMiddleware = require('../middlewares/checkAuthorizationMiddleware');


router.get('/:id', categorieController.categorie_listing);
router.post('/', checkAuthMiddleware.checkAuth, categorieController.categorie_post);
router.put('/update', checkAuthMiddleware.checkAuth, categorieController.categorie_put);
router.delete('/delete/:id', checkAuthMiddleware.checkAuth, categorieController.categorie_delete);

module.exports = router;
