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
  Event.create({
    user_id: req.body.user_id,
    name: req.body.name,
    password: req.body.password
  })
    .then(new_event => {
      res.status(201).send({"message" : "test"})
    })
    .catch(err => console.log(err));
}

// PUT one event
const event_put = (req, res) => {
  Event.update({ name: req.body.name },
    {
      where: {
        id: req.params.id
      }
    })
      .then(updated_event => {
          res.status(200).send({"message": "Event updated"})
      })
      .catch(err => console.log(err));
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
  event_put,
  event_delete
}