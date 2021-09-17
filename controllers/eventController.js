const Event = require('../models/Event');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Plat = require('../models/Plat');
const Categorie = require('../models/Categorie');
const { Op } = require("sequelize");
const Order = require('../models/Order');
const OrderPlats = require('../models/OrderPlats');
const fs = require("fs");

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

  Event.findAll({ where: { user_id: decoded_token.id } })
    .then(events => {
      res.status(200).send({ events })
    })
    .catch(err => {
      res.status(500).send({ "error": "Something went wrong" });
    })
}

// GET event to manage orders
const event_manage = (req, res) => {
  const event_id = req.params.id;
  // Get user_id
  const token = req.headers.authorization.split(" ")[1];
  const decoded_token = jwt.decode(token);

  Order.findAll({ where: { event_id: event_id }, include: { model: OrderPlats, include: [Plat] } })
    .then(orders => {

      let platsOrderedInEvent = [];

      orders.forEach(order => {
        order.orders_plats.forEach(orderedPlats => {

          platsOrderedInEvent.push({
            "id": orderedPlats.plat.id,
            "libelle": orderedPlats.plat.libelle,
            "quantity": orderedPlats.plat.quantity,
            "photo_url": orderedPlats.plat.photo_url,
            "quantity": orderedPlats.quantity,
            "price": orderedPlats.plat.price,
            "total": orderedPlats.quantity * orderedPlats.plat.price
          });

        });
      });



      const ids = platsOrderedInEvent.map(el => el.id); // return new array with all plats id's

      // Find if plat is duplicated; if yes, total amount is calculated
      ids.filter((id, index) => {
        const firstExistingId = ids.indexOf(id);
        if (firstExistingId !== index) {
          platsOrderedInEvent[firstExistingId].quantity += platsOrderedInEvent[index].quantity;
          platsOrderedInEvent[firstExistingId].total += platsOrderedInEvent[index].total;
          platsOrderedInEvent.splice(index, 1);
        }
      });

      // Calcul total budget
      const totalAmounts = platsOrderedInEvent.map(el => el.total); // return new array with total amount for each plats
      const reducer = (previousValue, currentValue) => previousValue + currentValue;
      const totalBudget = totalAmounts.reduce(reducer); // sum of all amounts

      res.status(200).send({ "plats": platsOrderedInEvent, "totalBudget": totalBudget });
    }).catch(err => {
      console.log(err);
    })


}

// GET event with Plats + Categorie
const event_get = (req, res) => {
  const event_id = req.params.id;
  const password = req.params.password;

  Event.findByPk(event_id, { include: { model: Categorie, include: [Plat] } })
    .then(event => {
      if (event.password !== password) {
        res.status(401).send({ "message": "Le mot de passe est incorrect !" });
      } else {
        res.status(200).send({ event });
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
    password: req.body.password,
    address: req.body.address,
    city: req.body.city,
    zipcode: req.body.zipcode,
    date: req.body.date,
    description: req.body.description,
    photo_url: process.env.URL_BACK + "/events/pictures/" + req.file.filename,
    private: req.body.private
  })
    .then(resp => {
      res.status(201).send({ "message": "Event created", "event": resp })
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ "error": "Something went wrong" });
    })


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

const event_image = (req, res) => {
  const path = process.env.IMAGE_PATH + req.params.filename;

  try {
    fs.readFile(path, (err, data) => {
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(data);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({});
  }
}


module.exports = {
  event_listing,
  event_created,
  event_manage,
  event_get,
  event_post,
  event_put,
  event_delete,
  event_image
}