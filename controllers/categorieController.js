const Categorie = require('../models/Categorie');

const categorie_listing = (req, res) => {
    Categorie.findAll()
    .then(categories => {
      console.log(categories);
      res.sendStatus(200);
    })
    .catch(err => console.log(err))
}

module.exports = {
    categorie_listing
}