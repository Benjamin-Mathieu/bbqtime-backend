const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');
const checkAuthMiddleware = require('../middlewares/checkAuthorization');

/* GET users listing. */
router.get('/:id', categorieController.categorie_listing);
router.post('/', checkAuthMiddleware.checkAuth, categorieController.categorie_post);
router.put('/:id', checkAuthMiddleware.checkAuth, categorieController.categorie_put);
router.delete('/:id', checkAuthMiddleware.checkAuth, categorieController.categorie_delete);

module.exports = router;
