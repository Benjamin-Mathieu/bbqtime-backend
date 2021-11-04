// Libraries
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const fs = require("fs");
const qrcode = require("qrcode");

// Services
const email = require("../services/email");

// Models
const Event = require('../models/Event');
const Plat = require('../models/Plat');
const Categorie = require('../models/Categorie');
const Order = require('../models/Order');
const OrderPlats = require('../models/OrderPlats');
const User = require("../models/User");
const Associate = require("../models/Associate");

// GET: participate event 
const event_participate = (req, res) => {

  let currentPage = parseInt(req.params.page);
  const size = 4;
  let offset = (currentPage - 1) * size;

  Event.findAndCountAll({
    limit: size,
    offset: offset,
    where: {
      [Op.not]: [
        { user_id: req.userData.id },
      ]
    }, include: { model: Order, where: { user_id: req.userData.id } }
  })
    .then(events => {
      let totalPages = Math.round(events.count / size);

      res.status(200).send({ "count": events.count, "totalPages": totalPages, "currentPage": currentPage, "events": events.rows });
    })
    .catch((err) => {
      res.sendStatus(500).send({ "message": `Une erreur s'est produite ${err}` });
    });
}

// GET: public events
const event_public = (req, res) => {
  let currentPage = parseInt(req.params.page);
  const size = 4;
  let offset = (currentPage - 1) * size;

  if (req.headers.authorization.split(" ")[1] == "null") {
    Event.findAndCountAll({
      limit: size,
      offset: offset,
      where: { private: 0 }
    })
      .then(events => {
        if (events === null) {
          res.status(200).send({ "message": "Pas d'évènement à afficher " });
        }

        let totalPages = Math.round(events.count / size);

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage <= 0) currentPage = 1;
        res.status(200).send({ "count": events.count, "totalPages": totalPages, "currentPage": currentPage, "events": events.rows });
      })
      .catch((err) => {
        res.sendStatus(500).send({ "message": `Une erreur s'est produite ${err}` });
      });
  } else {
    const token = req.headers.authorization.split(" ")[1];
    const decoded_token = jwt.decode(token);

    Event.findAndCountAll({
      limit: size,
      offset: offset,
      where: {
        [Op.not]: [
          { user_id: decoded_token.id },
        ],
        [Op.and]: [
          { private: 0 },
        ]
      }
    })
      .then(events => {
        if (events === null) {
          res.status(200).send({ "message": "Pas d'évènement à afficher " });
        }
        let totalPages = Math.round(events.count / size);

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage <= 0) currentPage = 1;

        res.status(200).send({ "count": events.count, "totalPages": totalPages, "currentPage": currentPage, "events": events.rows });
      })
      .catch((err) => {
        res.sendStatus(500).send({ "message": `Une erreur s'est produite ${err}` });
      });
  }
}

// GET: events created + user who is admin
const event_my_events_and_associate_events = async (req, res) => {

  try {
    const my_events = await Event.findAll({
      where: { user_id: req.userData.id }
    });

    const associated_events = await Associate.findAll({ where: { user_id: req.userData.id }, include: [Event] });

    associated_events.forEach(e => {
      my_events.push(e.event);
    });

    res.status(200).send({ "events": my_events });

  } catch (error) {
    res.status(500).send({ "message": `Une erreur s'est produite ${error}` });
  }
}

// GET: all orders by user of an event
const event_orders = (req, res) => {
  const event_id = req.params.id;

  Order.findAll({
    where: { event_id: event_id },
    include: [
      { model: User, attributes: ['id', 'name', 'firstname', 'email', 'phone'] },
      { model: OrderPlats, attributes: ['quantity', 'plat_id'], include: { model: Plat, attributes: ['id', 'libelle', 'photo_url'] } }
    ]
  })
    .then(orders => {
      res.status(200).send({ orders });
    })
    .catch(err => {
      res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
    })
}

// GET: event to manage orders (status, ordered plats, total budget)
const event_manage = async (req, res) => {
  const event_id = req.params.id;
  const event = await Event.findByPk(event_id);

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

        res.status(200).send({ "plats": platsOrderedInEvent, "totalBudget": totalBudget, "event": event });
      } else {
        res.status(200).send({ "message": "Aucune commande pour le moment", "event": event });
      }

    }).catch(err => {
      res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
    })


}

// GET: event with Plats + Categories
const event_get = (req, res) => {
  const event_id = req.params.id;

  Event.findByPk(event_id, {
    include: {
      model: Categorie,
      attributes: ["event_id", "id", "libelle"]
      ,
      include: {
        model: Plat,
        attributes: ["category_id", "description", "id", "libelle", "photo_url", "price", "stock"]
      }
    }
  })
    .then(event => {
      res.status(200).send({ event });
    })
    .catch(err => {
      res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
    });
}

// GET: join event by password typed from user
const event_join = async (req, res) => {
  const password = req.params.password;

  try {
    const event = await Event.findOne({ where: { password: password }, include: { model: Categorie, include: [Plat] } });

    if (event) {
      res.status(200).send({ "message": "Evènement rejoint", "event": event });
    } else {
      res.status(400).send({ "message": "Aucun évènement n'est lié à ce code, réessayez !" });
    }
  } catch (error) {
    res.status(500).send({ "message": `Une erreur s'est produite ${error}` });
  }
}

// POST: duplicate event
const event_duplicate = async (req, res) => {
  const event = await Event.findOne({ where: { id: req.body.id }, include: { model: Categorie, include: [Plat] } });

  const new_event = await Event.create({
    user_id: req.userData.id,
    name: event.name,
    password: "",
    address: event.address,
    city: event.city,
    zipcode: event.zipcode,
    date: event.date,
    description: event.description,
    photo_url: process.env.URL_BACK + "/events/pictures/" + req.file.filename,
    private: event.private,
    qrcode: ""
  });

  // Update password & qrcode
  const slice_password = event.password.slice(event.password.indexOf("-"));
  const new_password = `${new_event.id}${slice_password}`;
  const qrc = await qrcode.toDataURL(new_password, { width: 500 });
  new_event.update({ password: new_password, qrcode: qrc });

  event.categories.forEach(async (categorie) => {
    try {
      const new_ctg = await Categorie.create({
        event_id: new_event.id,
        libelle: categorie.libelle
      });

      categorie.plats.forEach(async (plat) => {
        await Plat.create({
          libelle: plat.libelle,
          photo_url: plat.photo_url,
          user_id: req.userData.id,
          stock: plat.stock,
          price: plat.price,
          description: plat.description,
          category_id: new_ctg.id
        });
      });

    } catch (error) {
      res.status(400).send({ "message": `Une erreur s'est produite pendant la copie: ${err}` });
    }
  });

  try {
    const event_duplicated = await Event.findByPk(new_event.id);
    res.status(201).send({ "message": "Evènement copié avec succés", "event": event_duplicated });

  } catch (error) {
    res.status(400).send({ "message": `Une erreur s'est produite pendant la copie: ${error}` });
  }
}


// POST: new event
const event_post = async (req, res) => {

  const event = await Event.create({
    user_id: req.userData.id,
    name: req.body.name,
    password: req.body.password,
    address: req.body.address,
    city: req.body.city,
    zipcode: req.body.zipcode,
    date: req.body.date,
    description: req.body.description,
    photo_url: process.env.URL_BACK + "/events/pictures/" + req.file.filename,
    private: req.body.private,
    qrcode: ""
  });

  if (event) {
    // Generate QrCode
    const new_password = event.id.toString() + "-" + event.password;
    const qrc = await qrcode.toDataURL(new_password, { width: 500 });
    await event.update({ qrcode: qrc, password: new_password });
    res.status(201).send({ "message": "Evènement crée avec succés", "event": event });
  } else {
    res.status(500).send({ "message": `Une erreur s'est produite pendant la création de l'évènement` });
  }
}

// PUT: event
const event_put = async (req, res) => {
  const event = await Event.findByPk(req.body.id, { where: { user_id: req.userData.id } });

  if (event) {
    try {
      if (req.body.password !== event.password) {
        const new_password = req.body.id.toString() + "-" + req.body.password;
        const qrc = await qrcode.toDataURL(new_password, { width: 500 });

        const update_event = await event.update({
          name: req.body.name,
          password: new_password,
          address: req.body.address,
          city: req.body.city,
          zipcode: req.body.zipcode,
          date: req.body.date,
          description: req.body.description,
          photo_url: process.env.URL_BACK + "/events/pictures/" + req.file.filename,
          private: req.body.private,
          qrcode: qrc
        });

        res.status(200).send({ "message": 'Evènement mis à jour', "event": update_event });
      } else {
        const update_event = await event.update({
          name: req.body.name,
          address: req.body.address,
          city: req.body.city,
          zipcode: req.body.zipcode,
          date: req.body.date,
          description: req.body.description,
          photo_url: process.env.URL_BACK + "/events/pictures/" + req.file.filename,
          private: req.body.private,
        });

        res.status(200).send({ "message": 'Evènement mis à jour', "event": update_event });
      }

    } catch (error) {
      res.status(500).send({ "message": `Une erreur s'est produite ${error}` });
    }
  } else {
    res.status(404).send({ "message": `L'évènement n'existe pas` });
  }
}

// DELETE: event & image file
const event_delete = async (req, res) => {
  const event = await Event.findByPk(req.body.id);
  const img = event.photo_url.split("/");
  try {
    fs.unlinkSync(`${process.env.IMAGE_PATH}${img[5]}`); // file removed
  } catch (err) {
    console.error(err)
  }

  Event.findOne({
    where: {
      id: req.body.id
    },
    include: { model: Order }
  })
    .then(event => {
      if (!event) {
        return res.status(404).send({ "message": "L'évènement n'existe pas" });
      }

      if (event && (event.user_id !== req.userData.id)) {
        return res.status(401).send({ "message": "Vous n'avez pas les droits pour supprimer cet évènement" });
      }

      if (event && (event.user_id === req.userData.id) && event.orders.length > 0) {
        return res.status(400).send({ "message": "Suppression de l'évènement impossible car des commandes sont déjà en cours" });
      } else {
        Event.destroy({
          where: { id: event.id }
        })
          .then(() => {
            res.status(200).send({ "message": "Evènement supprimé" });
          })
          .catch(err => res.status(400).send({ "message": `Erreur pendant la suppression: ${err}` }));
      }
    })
    .catch(err => res.status(500).send({ "message": `Erreur: ${err}` }));
}

// GET: file uploaded from user
const event_image = (req, res) => {
  const path = process.env.IMAGE_PATH + req.params.filename;

  try {
    fs.readFile(path, (err, data) => {
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(data);
    });
  } catch (err) {
    res.status(500).send({ "message": "Erreur lecture image" });
  }
}

// POST: an email to invite user to join event
const event_sendInvitation = async (req, res) => {
  const event_id = req.body.event_id;

  try {
    await email.sendEmailInvitation(req.body.email, event_id);
    res.status(200).send({ "message": `Email envoyé à ${req.body.email} !` });
  } catch (error) {
    res.status(400).send({ "message": `Erreur pendant l'envoi: ${error}` })
  }
}

// GET: all associates from event
const event_listAssociate = async (req, res) => {
  try {
    const associates = await Associate.findAll({
      where: { event_id: req.params.id },
      attributes: ["id"],
      include: { model: User, attributes: ["email", "name", "firstname"] }
    });

    res.status(200).send({ associates });
  } catch (error) {
    res.status(500).send({ "message": `Une erreur s'est produite: ${err}` });
  }
}

// DELETE: associate from event
const event_delete_associate = async (req, res) => {
  try {
    await Associate.destroy({ where: { id: req.body.id } });
    res.status(200).send({ "message": "Associé supprimé" });
  } catch (err) {
    res.status(500).send({ "message": `Une erreur s'est produite: ${err}` });
  }
}

// POST: new associate
const event_addAssociate = async (req, res) => {
  const event = await Event.findOne({
    where: {
      [Op.and]: [
        { id: req.body.event_id },
        { user_id: req.userData.id }
      ]
    },
    include: [Associate]
  });

  if (event) {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
      let ids = [];
      event.associate_events.forEach(associate => {
        ids.push(associate.user_id);
      });

      if (ids.includes(user.id)) {
        return res.status(400).send({ "message": `L'utilisateur correspondant à l'adresse ${user.email} est déjà administrateur` });
      }

      Associate.findOrCreate({
        where: {
          event_id: event.id,
          user_id: user.id
        }
      })
        .then(async () => {
          await email.sendEmailPreventAdminAdd(user.email, event.id);
          res.status(201).send({ "message": "Administrateur ajouté" });
        })
        .catch(err => {
          res.status(400).send({ "message": `Erreur pendant l'envoi: ${err}` });
        })
    } else {
      // Create new user if no user find
      const rInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      const code = rInt(100000, 999999);

      const saltRounds = 10;
      const hash = bcrypt.hashSync(code.toString(), saltRounds);

      User.create({
        email: req.body.email,
        name: "",
        firstname: "",
        phone: "",
        password: hash,
        zipcode: ""
      })
        .then(async (resNewUser) => {
          await Associate.create({ user_id: resNewUser.id, event_id: event.id });
          await email.sendEmailPreventAdminAdd(resNewUser.email, event.id, resNewUser, code);
          res.status(201).send({ "message": "Administrateur ajouté" });
        })
        .catch(err => {
          res.status(400).send({ "message": `Erreur pendant l'envoi: ${err}` });
        })
    }
  } else {
    res.status(400).send({ "message": `Vous ne pouvez pas ajouter un administrateur sur cet évènement` });
  }
}

module.exports = {
  event_public,
  event_participate,
  event_my_events_and_associate_events,
  event_manage,
  event_get,
  event_join,
  event_post,
  event_put,
  event_delete,
  event_image,
  event_sendInvitation,
  event_orders,
  event_addAssociate,
  event_listAssociate,
  event_duplicate,
  event_delete_associate
}