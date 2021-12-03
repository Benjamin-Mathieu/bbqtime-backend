const Categorie = require('../models/Categorie');
const Plat = require('../models/Plat');
const { Op } = require("sequelize");

// GET all categories from an event
const categorie_listing = async (req, res) => {
  try {
    const categories = await Categorie.findAll({ where: { event_id: req.params.id }, include: [Plat] });
    res.status(200).send({ categories });
  } catch (err) {
    res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
  }
}

// POST new category
const categorie_post = async (req, res) => {

  try {
    const [categorie, created] = await Categorie.findOrCreate({
      where: { [Op.and]: [{ libelle: req.body.libelle }, { event_id: req.body.event_id }] },
      defaults: {
        event_id: req.body.event_id,
        libelle: req.body.libelle
      }
    });

    if (created) {
      res.status(201).send({
        "message": "Catégorie ajoutée !",
        "categorie": categorie
      });
    } else {
      res.status(400).send({
        "message": "Catégorie existante !",
        "categorie": categorie
      });
    }
  } catch (error) {
    res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
  }
}

// UPDATE category
const categorie_put = (req, res) => {
  Categorie.update({ libelle: req.body.libelle }, { where: { id: req.body.id } })
    .then(categorie => {
      res.status(200).send({ "message": "Catégorie mis à jour !", "categorie": categorie });
    })
    .catch(err => {
      console.error(err);
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
    .then(plat => {
      res.status(200).send({ "message": "Catégorie supprimée !", "plat": plat })
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
    });
}

module.exports = {
  categorie_listing,
  categorie_post,
  categorie_put,
  categorie_delete
}