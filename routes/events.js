const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const checkAuthMiddleware = require('../middlewares/checkAuthorization');
const cors = require('cors');

// router.get('/', eventController.event_listing);
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


router.get('/', cors(corsOptions), checkAuthMiddleware.checkAuth, eventController.event_listing);
router.get('/:id/:password', checkAuthMiddleware.checkAuth, eventController.event_get);
router.post('/', checkAuthMiddleware.checkAuth, eventController.event_post);
router.put('/:id', checkAuthMiddleware.checkAuth, eventController.event_put);
router.delete('/:id', checkAuthMiddleware.checkAuth, eventController.event_delete);

module.exports = router;
