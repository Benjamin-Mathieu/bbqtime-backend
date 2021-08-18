const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.user_listing);
router.get('/:id', userController.user_get);
router.post('/', userController.user_post);
router.delete('/:id', userController.user_delete);
router.post('/login', userController.user_login);

module.exports = router;
