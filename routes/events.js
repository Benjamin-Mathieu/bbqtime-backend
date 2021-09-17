const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const checkAuthMiddleware = require('../middlewares/checkAuthorization');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const checkCodeMiddleware = require('../middlewares/checkCodeMiddleware');

router.get('/', checkAuthMiddleware.checkAuth, eventController.event_listing);
router.get('/myEvents', checkAuthMiddleware.checkAuth, eventController.event_created);
router.get('/myEvents/:id', checkAuthMiddleware.checkAuth, eventController.event_manage);
router.get('/:id/:password', checkAuthMiddleware.checkAuth, eventController.event_get);
router.post('/', checkAuthMiddleware.checkAuth, uploadMiddleware.upload('image'), checkCodeMiddleware.checkCode, eventController.event_post);
router.put('/:id', checkAuthMiddleware.checkAuth, eventController.event_put);
router.delete('/:id', checkAuthMiddleware.checkAuth, eventController.event_delete);
router.get("/pictures/:filename", eventController.event_image);

module.exports = router;
