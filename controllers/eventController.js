const Event = require('../models/Event');

// GET all events
const event_listing = (req, res) => {
    Event.findAll()
    .then(events => {
      let events_array = [];
        events.forEach(event => {
          events_array.push(event);
        });
        res.status(200).send({ "events": events_array });
    })
    .catch(err => console.log(err))
}

// GET one event
const event_get = (req, res) => {
  const event_id = req.params.id;

  Event.findByPk(event_id)
      .then(event => {
          res.status(200).send(
              {
                  id: event.id,
                  user_id: event.user_id,
                  name: event.name,
                  password: event.password
              }
          )
      })
      .catch(err => console.log(err))
}

// POST new event
const event_post = (req, res) => {
  
}

// DELETE one event
const event_delete = (req, res) => {
  Event.destroy({
      where: {
        id: req.params.id
      }
  })
      .then(deleted_event => {
          res.status(200).send({"message": "Event deleted"})
      })
      .catch(err => console.log(err));
}

module.exports = {
  event_listing,
  event_get,
  event_post,
  event_delete
}