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
            res.status(500).send({ "error": "Something went wrong" });
        });
}

const orderplats_post = (req, res) => {
    OrderPlats.create({
        plat_id: req.body.plat_id,
        order_id: req.body.order_id,
        quantity: req.body.quantity
    })
        .then(result => {
            res.status(201).send({ "message": "Added to card" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": "Something went wrong" });
        });
}

module.exports = {
    orderplats_listing,
    orderplats_post
};