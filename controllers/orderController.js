const Order = require('../models/Order');

const order_listing = (req, res) => {
    Order.findAll()
    .then(orders => {
        let orders_array = [];
        orders.forEach(event => {
          orders_array.push(event);
        });
        res.status(200).send({ "orders": orders_array });
    })
    .catch(err => console.log(err))
}

// GET one order
const order_get = (req, res) => {
    const order_id = req.params.id;
  
    Order.findByPk(order_id)
        .then(order => {
            res.status(200).send(
                {
                    id: order.id,
                    event_id: order.event_id,
                    user_id: order.user_id,
                    cost: order.cost,
                    heure: order.heure
                }
            )
        })
        .catch(err => console.log(err))
}

// POST new order
const order_post = (req, res) => {
    Order.create({
        event_id: req.body.event_id,
        user_id: req.body.user_id,
        cost: req.body.cost,
        heure: req.body.heure
    })
      .then(new_order => {
        res.status(201).send({"message" : "Order created"})
      })
      .catch(err => console.log(err));
}

// DELETE one order
const order_delete = (req, res) => {
    Order.destroy({
        where: {
          id: req.params.id
        }
    })
        .then(deleted_order => {
            res.status(200).send({"message": "Order deleted"})
        })
        .catch(err => console.log(err));
}

module.exports = {
    order_listing,
    order_get,
    order_post,
    order_delete
}