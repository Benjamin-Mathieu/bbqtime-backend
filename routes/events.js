const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

/* GET events */
router.get('/', eventController.event_listing);

// Add event
// router.post('/',);

module.exports = router;
