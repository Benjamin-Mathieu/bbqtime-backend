const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');

/* GET users listing. */
router.get('/', categorieController.categorie_listing);
router.post('/', categorieController.categorie_post);
router.delete('/:id', categorieController.categorie_delete);

module.exports = router;
