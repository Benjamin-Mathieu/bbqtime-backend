const Order = require('../models/Order');
const Event = require('../models/Event');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const OrderPlats = require('../models/OrderPlats');
const Plat = require('../models/Plat');
const notification = require("../services/notification");
const email = require("../services/email");

const order_listing = (req, res) => {
    Order.findAll({
        include: [
            { model: Event },
            { model: OrderPlats, attributes: ['id', 'plat_id', 'quantity'], include: [Plat] }
        ],
        where: { user_id: req.userData.id }
    })
        .then(orders => {
            res.status(200).send({ "orders": orders });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
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
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        });
}

// PUT one order | ORDER_INPREPARATION = 0 | ORDER_PREPARED = 1 | ORDER_DELIVERED = 2
const order_put = (req, res) => {
    const order_id = req.params.id;
    const status = req.body.status;

    Order.findByPk(order_id, { include: { model: Event, attributes: ["user_id"] } })
        .then(async order => {

            if (order.event.user_id !== req.userData.id) {
                return res.status(401).send({
                    message:
                        "Vous n'avez pas les droits pour changer le status de cette commande",
                });
            }

            await order.update({ status: status });
            notification.sendNotificationOrderStatus(order_id);

            return res.status(200).send({ message: 'Status de la commande mis à jour' });

        })
        .catch(err => {
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        })
}

// POST new order
const order_post = (req, res) => {
    let totalOrder = 0;

    req.body.plats.forEach(plat => {
        totalOrder += plat.price * plat.qty;
    });

    Order.create({
        event_id: req.body.event_id,
        user_id: req.userData.id,
        cost: totalOrder,
        heure: new Date(),
        status: 0
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
            res.status(201).send({ "message": "Commande effectuée !", "order": newOrder });
            notification.sendNotificationNewOrder(req.body.event_id);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        });
}

// DELETE one order
const order_delete = (req, res) => {
    Order.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(order => {
            res.status(200).send({ "message": "Commande supprimée !", "order": order })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        });
}

module.exports = {
    order_listing,
    order_get,
    order_put,
    order_post,
    order_delete
}