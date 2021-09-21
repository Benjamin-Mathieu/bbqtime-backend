const Order = require('../models/Order');
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');
const OrderPlats = require('../models/OrderPlats');
const Plat = require('../models/Plat');
const { ProxyAuthenticationRequired } = require('http-errors');

const order_listing = (req, res) => {

    // Collect users information
    const token = req.headers.authorization.split(" ")[1];
    const decoded_token = jwt.decode(token);

    Order.findAll({
        include: [
            { model: Event },
            { model: OrderPlats, attributes: ['id', 'plat_id', 'quantity'], include: [Plat] }
        ],
        where: { user_id: decoded_token.id }
    })
        .then(orders => {
            res.status(200).send({ "orders": orders });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "error": "Something went wrong" });
        });
}

// GET one order
const order_get = (req, res) => {
    const order_id = req.params.id;

    Order.findByPk(order_id, {
        include: [
            { model: OrderPlats, attributes: ['id', 'plat_id', 'quantity'], include: [Plat] }
        ]
    })
        .then(order => {
            res.status(200).send({ "order": order });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "error": "Something went wrong" });
        });
}

// POST new order
const order_post = (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded_token = jwt.decode(token);
    let totalOrder = 0;


    req.body.plats.forEach(plat => {
        totalOrder += plat.price * plat.qty;
    });


    Order.create({
        event_id: req.body.event_id,
        user_id: decoded_token.id,
        cost: totalOrder,
        heure: req.body.heure
    })
        .then(newOrder => {
            req.body.plats.forEach(plat => {
                OrderPlats.create({
                    plat_id: plat.id,
                    order_id: newOrder.id,
                    quantity: plat.qty
                })
                    .then(() => {
                        // Update stock
                        let updateStock = plat.stock - plat.qty
                        Plat.update({ stock: updateStock }, { where: { id: plat.id } });
                    })
            });
            res.status(201).send({ "message": "Order created", "order": newOrder })
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