const Categorie = require('../models/Categorie');

// GET all products
const categorie_listing = (req, res) => {
  Categorie.findAll()
    .then(result => {

      let categories = [];
      result.forEach(categorie => {
        categories.push(categorie);
        console.log(categories);
      });
      res.status(200).send({ "categories": categories });

    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "error": "Something went wrong" });
    });
}

// POST new product
const categorie_post = (req, res) => {
  Categorie.findOrCreate({ where: { libelle: req.body.libelle } })
    .then(result => {
      res.status(201).send({
        "message": "Category addedaz",
        "categorie": result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "error": "Something went wrong" });
    });
}

// UPDATE one product
const categorie_put = (req, res) => {
  Categorie.update({ libelle: req.body.libelle }, { where: { id: req.params.id } })
    .then(result => {
      res.status(200).send({ "message": "Category updated" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "message": "Something went wrong" });
    })
}

// DELETE one product
const categorie_delete = (req, res) => {
  Categorie.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(deleted_product => {
      res.status(200).send({ "message": "Category deleted" })
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ "error": "Something went wrong" });
    });
}

module.exports = {
  categorie_listing,
  categorie_post,
  categorie_put,
  categorie_delete
}