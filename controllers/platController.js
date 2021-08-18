const Plat = require('../models/Plat');

const plat_listing = (req, res) => {
    Plat.findAll()
    .then(plats => {
        console.log(plats);
        res.sendStatus(200);
    })
    .catch(err => console.log(err))
}

module.exports = {
    plat_listing
}