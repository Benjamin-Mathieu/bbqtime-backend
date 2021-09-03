const Event = require('../models/Event');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Plat = require('../models/Plat');
const Categorie = require('../models/Categorie');
const { Op } = require("sequelize");

// GET events created by the user connected + all public events
const event_listing = (req, res) => {

  // Get user_id
  const token = req.headers.authorization.split(" ")[1];
  const decoded_token = jwt.decode(token);

  Event.findAll({
    where: {
      [Op.or]: [{ user_id: decoded_token.id }, { private: 0 }]
    }
  })
    .then(result => {
      console.log("NB EVENT", result.length);
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

// GET one event with Plats + Categorie
const event_get = (req, res) => {
  const event_id = req.params.id;

  Event.findByPk(event_id, {
    include: { model: Plat, include: [Categorie] }
  })
    .then(event => {
      res.status(200).send({ event })
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