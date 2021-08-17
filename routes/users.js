const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.user_listing);
router.get('/:id', userController.user_get);
router.post('/', userController.user_post);

module.exports = router;
