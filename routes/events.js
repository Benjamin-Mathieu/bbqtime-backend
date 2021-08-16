const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Event = require('../models/Event');

/* GET events */
router.get('/', (req, res) => {
  Event.findAll()
    .then(events => {
      console.log(events);
      res.sendStatus(200);
    })
    .catch(err => console.log(err))
});

module.exports = router;
