const Event = require('../models/Event');

const event_listing = (req, res) => {
    Event.findAll()
    .then(events => {
      console.log(events);
      res.sendStatus(200);
    })
    .catch(err => console.log(err))
}

module.exports = {
    event_listing
}