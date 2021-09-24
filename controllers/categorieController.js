const Categorie = require('../models/Categorie');
const Event = require('../models/Event');
const Plat = require('../models/Plat');
const { Op } = require("sequelize");

// GET all categories from an event
const categorie_listing = (req, res) => {
  Categorie.findAll({ where: { event_id: req.params.id }, include: [Plat] })
    .then(result => {

      let categories = [];
      result.forEach(categorie => {
        categories.push(categorie);
      });
      res.status(200).send({ "categories": categories });

    })
    .catch(err => {
      res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
    });
}

// POST new category
const categorie_post = (req, res) => {
  Categorie.findOrCreate({
    where: { [Op.and]: [{ libelle: req.body.libelle }, { event_id: req.body.event_id }] },
    defaults: { event_id: req.body.event_id, libelle: req.body.libelle }
  })
    .then(result => {

      if (result[1]) {
        res.status(201).send({
          "message": "Catégorie ajoutée !",
          "categorie": result
        });
      } else {
        res.status(400).send({
          "message": "Catégorie existe déjà !",
          "categorie": result
        });
      }

    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
    });
}

// UPDATE category
const categorie_put = (req, res) => {
  Categorie.update({ libelle: req.body.libelle }, { where: { id: req.params.id } })
    .then(result => {
      res.status(200).send({ "message": "Catégorie mis à jour !" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
    })
}

// DELETE category
const categorie_delete = (req, res) => {
  Categorie.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(deleted_product => {
      res.status(200).send({ "message": "Catégorie supprimée !" })
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
    });
}

module.exports = {
  categorie_listing,
  categorie_post,
  categorie_put,
  categorie_delete
}