const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');

/* GET users listing. */
router.get('/', categorieController.categorie_listing);

module.exports = router;
