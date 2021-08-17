const Categorie = require('../models/Categorie');

// GET all products
const categorie_listing = (req, res) => {
    Categorie.findAll()
      .then(categories => {

        let products = [];
        categories.forEach(categorie => {
          products.push(categorie.libelle);
          console.log(products);
        });
        res.status(200).send({ "produits": products });

    })
    .catch(err => console.log(err))  
}

// POST new product
const categorie_post = (req, res) => {
  Categorie.findOrCreate({where: { libelle: req.body.libelle }})
    .then(new_product => {
        res.status(201).send({ "message": "Product added" });
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
}

// DELETE one product
const categorie_delete = (req, res) => {
  Categorie.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(deleted_product => {
        res.status(200).send({"message": "Product deleted"})
    })
    .catch(err => console.log(err));
}

module.exports = {
  categorie_listing,
  categorie_post,
  categorie_delete
}