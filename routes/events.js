const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const checkAuthMiddleware = require('../middlewares/checkAuthorizationMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

router.get('/public/:page', eventController.event_public);
router.get('/participate/:page', checkAuthMiddleware.checkAuth, eventController.event_participate);
router.get('/myEvents', checkAuthMiddleware.checkAuth, eventController.event_created_participate);
router.get('/myEvents/:id', checkAuthMiddleware.checkAuth, eventController.event_manage);
router.get("/myEvents/:id/orders", checkAuthMiddleware.checkAuth, eventController.event_orders);
router.get('/:id', eventController.event_get);
router.get('/join/:password', eventController.event_join);
router.get("/:id/associate", checkAuthMiddleware.checkAuth, eventController.event_listAssociate);
router.get("/pictures/:filename", eventController.event_image);

router.post('/', checkAuthMiddleware.checkAuth, uploadMiddleware.upload('image'), eventController.event_post);
router.post("/addAssociate", checkAuthMiddleware.checkAuth, eventController.event_addAssociate);
router.post("/mail/invitation", checkAuthMiddleware.checkAuth, eventController.event_sendInvitation);
router.post("/duplicate", checkAuthMiddleware.checkAuth, uploadMiddleware.upload('image'), eventController.event_duplicate);

router.put('/update', checkAuthMiddleware.checkAuth, uploadMiddleware.upload('image'), eventController.event_put);

router.delete('/delete', checkAuthMiddleware.checkAuth, eventController.event_delete);


module.exports = router;
