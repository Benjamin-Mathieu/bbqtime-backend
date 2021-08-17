const Order = require('../models/Order');

const order_listing = (req, res) => {
    Order.findAll()
    .then(orders => {
        console.log(orders);
        res.sendStatus(200);
    })
    .catch(err => console.log(err))
}

module.exports = {
    order_listing
}