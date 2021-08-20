const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

const test = (req, res) => {
  Event.findOne({
    where: { name: 'Chalet' }, include: 'user'
  })
    .then(findedUser => {
      console.log(findedUser);
      res.status(200).send({ "message": findedUser.user });
    })
    .catch((err) => {
      console.log("Error while find user : ", err);
      res.sendStatus(500);
    });
}

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

  const token = req.headers.authorization.split(" ")[1];
  const decoded_token = jwt.decode(token);

  Event.create({
    user_id: decoded_token.id,
    name: req.body.name,
    password: req.body.password
  })
    .then(new_event => {
      res.status(201).send({"message" : "Event created"})
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
  test,
  event_listing,
  event_get,
  event_post,
  event_put,
  event_delete
}