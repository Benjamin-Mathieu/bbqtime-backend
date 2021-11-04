const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuthMiddleware = require('../middlewares/checkAuthorizationMiddleware');

router.get("/isLogged", checkAuthMiddleware.checkAuth, userController.user_is_logged);
router.post('/', userController.user_post);
router.put('/update', checkAuthMiddleware.checkAuth, userController.user_put);
router.delete('/:id', checkAuthMiddleware.checkAuth, userController.user_delete);
router.post('/login', userController.user_login);
router.post('/send-code', userController.user_send_code);
router.post('/check-code', userController.user_check_code);
router.post('/reset-password', userController.user_reset_password);

module.exports = router;
