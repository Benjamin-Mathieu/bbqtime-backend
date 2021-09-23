const Event = require('../models/Event');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Plat = require('../models/Plat');
const Categorie = require('../models/Categorie');
const { Op } = require("sequelize");
const Order = require('../models/Order');
const OrderPlats = require('../models/OrderPlats');
const fs = require("fs");
const qrcode = require("qrcode");

// GET events all public events
const event_listing = (req, res) => {

  // Get user_id
  const token = req.headers.authorization.split(" ")[1];
  const decoded_token = jwt.decode(token);

  Event.findAll()
    .then(events => {
      if (events === null) {
        res.status(400).send({ "message": "Pas d'évènement à afficher " });
      }
      res.status(200).send({ events });
    })
    .catch((err) => {
      res.sendStatus(500).send({ "message": "Une erreur est survenue" });
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
      res.status(500).send({ "message": "Une erreur est survenue" });
    })
}

// GET event to manage orders
const event_manage = (req, res) => {
  const event_id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded_token = jwt.decode(token);

  Order.findAll({ where: { event_id: event_id }, include: { model: OrderPlats, include: [Plat] } })
    .then(orders => {

      if (orders.length > 0) {
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

        res.status(200).send({ "id": event_id, "plats": platsOrderedInEvent, "totalBudget": totalBudget });
      } else {
        res.status(200).send({ "id": event_id, "message": "Aucune commande pour le moment" });
      }

    }).catch(err => {
      res.status(500).send({ "message": "Une erreur est survenue: " + err });
    })


}

// GET event with Plats + Categorie
const event_get = (req, res) => {
  const event_id = req.params.id;

  Event.findByPk(event_id, { include: { model: Categorie, include: [Plat] } })
    .then(event => {
      res.status(200).send({ event });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "message": "Une erreur est survenue !" });
    });
}

// GET event with password typed by user
const event_join = (req, res) => {
  const password = req.params.password;

  Event.findOne({ where: { password: password }, include: { model: Categorie, include: [Plat] } })
    .then(event => {
      if (event === null) {
        res.status(400).send({ "message": "Aucun évènement est lié à ce Qrcode !" });
      } else {
        res.status(200).send({ event });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "message": "Une erreur est survenue !" });
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

  // Generate QrCode and create event
  qrcode.toDataURL(req.body.password, { width: 500 })
    .then(url => {
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
        private: req.body.private,
        qrcode: url
      })
        .then(resp => {
          res.status(201).send({ "message": "Evènement crée !", "event": resp });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send({ "message": "Une erreur est survenue !" });
        })
    });


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
      res.status(200).send({ "message": "Evènement mis à jour !" })
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "message": "Une erreur est survenue !" });
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
      res.status(200).send({ "message": "Evènement supprimé !" })
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "message": "Une erreur est survenue !" });
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
  event_join,
  event_post,
  event_put,
  event_delete,
  event_image
}