const OrderPlats = require('../models/OrderPlats');
const jwt = require('jsonwebtoken');

const test = (req, res) => {
    OrderPlats.findAll()
        .then(tests => {

            let test_array = [];
            tests.forEach(test => {
                test_array.push(test);
            });
            res.status(200).send({ "test": test_array });
        })
        .catch(err => console.log(err))
}

const orderplat_post = (req, res) => {
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
    test,
    orderplat_post
};