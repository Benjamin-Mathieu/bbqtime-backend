const Event = require('../models/Event');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Plat = require('../models/Plat');
const Categorie = require('../models/Categorie');
const { Op } = require("sequelize");
const Order = require('../models/Order');
const OrderPlats = require('../models/OrderPlats');

// GET events all public events
const event_listing = (req, res) => {

  // Get user_id
  const token = req.headers.authorization.split(" ")[1];
  const decoded_token = jwt.decode(token);

  Event.findAll({ where: { private: 0 } })
    .then(events => {
      if (events === null) {
        res.status(400).send({ "message": "No events to show" });
      }
      res.status(200).send({ events });
    })
    .catch((err) => {
      console.log("Error while find user : ", err);
      res.sendStatus(500).send({ "error": "Something went wrong" });
    });
}

// GET events created by user
const event_created = (req, res) => {

  // Get user_id
  const token = req.headers.authorization.split(" ")[1];
  const decoded_token = jwt.decode(token);
  let totalAmount = 0;
  let platsInOrders = [];


  Event.findAll({ where: { user_id: decoded_token.id }, include: { model: Order, include: { model: OrderPlats, include: [Plat] } } })
    .then(events => {
      if (events === null) {
        res.status(400).send({ "message": "No events to show" });
      }

      /* Calcul total amount 
      events: [
        orders: [
          id: 44,
          cost: 10,
          orders_plats: [
            order_id: 66,
            quantity: 2,
            plat_id: 1,
            plats: [
              id: 1
              price: 5,
              category_id
            ]
          ]
        ]
      ]
      */
      events.forEach(event => {
        event.orders.forEach(order => {
          totalAmount += order.cost;

          // Push plats in platsInOrders
          order.orders_plats.forEach(orderPlat => {
            platsInOrders.push({ id: orderPlat.plat.id, libelle: orderPlat.plat.libelle, photo_url: orderPlat.plat.libelle });
          });
        });
      });
      console.log("********", platsInOrders);
      res.status(200).send(
        {
          "event": events,
          "totalAmount": totalAmount
        }
      );
    })
    .catch((err) => {
      console.log("Error while find user : ", err);
      res.sendStatus(500).send({ "error": "Something went wrong" });
    });
}

// GET event with Plats + Categorie
const event_get = (req, res) => {
  const event_id = req.params.id;

  Event.findByPk(event_id, { include: { model: Categorie, include: [Plat] } })
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

  Event.create({
    user_id: decoded_token.id,
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    zipcode: req.body.zipcode,
    date: req.body.date,
    description: req.body.description,
    photo_url: req.body.photo_url,
    private: req.body.private
  })
    .then(resp => {
      res.status(201).send({ "message": "Event created", "event": resp })
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ "error": "Something went wrong" });
    })

  // Hash password
  // const saltRounds = 10;
  // const hash = bcrypt.hashSync(req.body.password, saltRounds);
}

// PUT event
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

// DELETE event
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
  event_created,
  event_get,
  event_post,
  event_put,
  event_delete
}