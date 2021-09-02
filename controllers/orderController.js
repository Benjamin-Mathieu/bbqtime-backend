const Order = require('../models/Order');
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');
const OrderPlats = require('../models/OrderPlats');
const Plat = require('../models/Plat');

const order_listing = (req, res) => {

    // Collect users information
    const token = req.headers.authorization.split(" ")[1];
    const decoded_token = jwt.decode(token);

    Order.findAll({
        include: [Event, OrderPlats],
        where: { user_id: decoded_token.id }
    })
        .then(orders => {
            console.log('test', orders);
            let orders_array = [];
            orders.forEach(event => {
                orders_array.push(event);
            });
            res.status(200).send({ "orders": orders_array, "event": orders.event });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "error": "Something went wrong" });
        });
}

// GET one order
const order_get = (req, res) => {
    const order_id = req.params.id;

    Order.findByPk(order_id)
        .then(order => {
            OrderPlats.findAll({
                where: {
                    order_id: order_id
                }, include: [Plat]
            })
                .then(orderPlats => {
                    let orderPlatWithPlat = [];
                    orderPlats.forEach(orderPlat => {
                        orderPlatWithPlat.push(orderPlat);
                    })
                    res.status(200).send({ "order": order, "order_plats": orderPlatWithPlat });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send({ "error": "Something went wrong" });
                });
        })
}

// POST new order
const order_post = (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded_token = jwt.decode(token);

    Order.create({
        event_id: req.body.event_id,
        user_id: decoded_token.id,
        cost: req.body.cost,
        heure: req.body.heure
    })
        .then(new_order => {
            res.status(201).send({ "message": "Order created" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "error": "Something went wrong" });
        });
}

// DELETE one order
const order_delete = (req, res) => {
    Order.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(deleted_order => {
            res.status(200).send({ "message": "Order deleted" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "error": "Something went wrong" });
        });
}

module.exports = {
    order_listing,
    order_get,
    order_post,
    order_delete
}