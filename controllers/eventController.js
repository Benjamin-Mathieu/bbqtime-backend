const Event = require('../models/Event');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Plat = require('../models/Plat');

// GET all events
// const event_listing = (req, res) => {
//   Event.findAll()
//     .then(events => {
//       let events_array = [];
//       events.forEach(event => {
//         events_array.push(event);
//       });
//       res.status(200).send({ "events": events_array });
//     })
//     .catch(err => console.log(err))
// }

const event_listing = (req, res) => {

  // Get user_id
  const token = req.headers.authorization.split(" ")[1];
  const decoded_token = jwt.decode(token);

  Event.findAll({
    where: { user_id: decoded_token.id }
  })
    .then(result => {
      if (result === null) {
        res.status(400).send({ "error": "No events to show" });
      } else {
        res.status(200).send({ "events": result });
      }
    })
    .catch((err) => {
      console.log("Error while find user : ", err);
      res.sendStatus(500).send({ "error": "Something went wrong" });
    });
}

// GET one event
const event_get = (req, res) => {
  const event_id = req.params.id;

  Event.findByPk(event_id, { include: [Plat] })
    .then(event => {
      if (!bcrypt.compareSync(req.params.password, event.password)) {
        res.status(401).send({ "message": "Wrong password" });
      }
      else {
        res.status(200).send(
          {
            "event": {
              id: event.id,
              user_id: event.user_id,
              name: event.name,
              password: event.password,
              "plat": event.plats
            }
          }
        )
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "error": "Something went wrong" });
    });
}

// POST new event
const event_post = (req, res) => {

  // Get token of connected user
  const token = req.headers.authorization.split(" ")[1];
  const decoded_token = jwt.decode(token);

  // Hash password
  // const saltRounds = 10;
  // const hash = bcrypt.hashSync(req.body.password, saltRounds);

  Event.create({
    user_id: decoded_token.id,
    name: req.body.name,
    // password: hash,
    address: req.body.address,
    city: req.body.city,
    zipcode: req.body.zipcode,
    date: req.body.date,
    description: req.body.description,
    photo_url: req.body.photo_url,
    private: req.body.private
  })
    .then(new_event => {
      res.status(201).send({
        "message": "Event created",
        "id": new_event.id
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "error": "Something went wrong" });
    });
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
      res.status(200).send({ "message": "Event updated" })
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "error": "Something went wrong" });
    });
}

// DELETE one event
const event_delete = (req, res) => {
  Event.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(deleted_event => {
      res.status(200).send({ "message": "Event deleted" })
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "error": "Something went wrong" });
    });
}

module.exports = {
  event_listing,
  event_get,
  event_post,
  event_put,
  event_delete
}