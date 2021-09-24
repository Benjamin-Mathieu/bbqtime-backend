const OrderPlats = require('../models/OrderPlats');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Plat = require('../models/Plat');

const orderplats_listing = (req, res) => {
    OrderPlats.findAll({ include: [Plat] })
        .then(orderplats => {
            res.status(200).send({ "order-plats": orderplats });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        });
}

const orderplats_post = (req, res) => {
    OrderPlats.create({
        plat_id: req.body.plat_id,
        order_id: req.body.order_id,
        quantity: req.body.quantity
    })
        .then(result => {
            res.status(201).send({ "message": "Ajouté au panier" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        });
}

module.exports = {
    orderplats_listing,
    orderplats_post
};