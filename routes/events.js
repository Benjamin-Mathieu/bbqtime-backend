const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const checkAuthMiddleware = require('../middlewares/checkAuthorization');

// router.get('/', eventController.event_listing);

router.get('/', checkAuthMiddleware.checkAuth, eventController.event_listing);
router.get('/:id/:password', checkAuthMiddleware.checkAuth, eventController.event_get);
router.post('/', checkAuthMiddleware.checkAuth, eventController.event_post);
router.put('/:id', checkAuthMiddleware.checkAuth, eventController.event_put);
router.delete('/:id', checkAuthMiddleware.checkAuth, eventController.event_delete);

module.exports = router;
