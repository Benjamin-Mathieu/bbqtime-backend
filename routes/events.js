const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const checkAuthMiddleware = require('../middlewares/checkAuthorizationMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const checkCodeMiddleware = require('../middlewares/checkCodeMiddleware');

router.get('/', eventController.event_listing);
router.get('/myEvents', checkAuthMiddleware.checkAuth, eventController.event_created);
router.get('/myEvents/:id', checkAuthMiddleware.checkAuth, eventController.event_manage);
router.get('/:id', checkAuthMiddleware.checkAuth, eventController.event_get);
router.get('/join/:password', checkAuthMiddleware.checkAuth, eventController.event_join);
router.post('/', checkAuthMiddleware.checkAuth, uploadMiddleware.upload('image'), checkCodeMiddleware.checkCode, eventController.event_post);
router.put('/:id', checkAuthMiddleware.checkAuth, eventController.event_put);
router.delete('/:id', checkAuthMiddleware.checkAuth, eventController.event_delete);
router.get("/pictures/:filename", eventController.event_image);
router.post("/mail/invitation", eventController.event_sendInvitation);

module.exports = router;
