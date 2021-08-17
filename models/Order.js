const Sequelize = require('sequelize');
const db = require('../config/database');

const Order = db.define('order', {
    event_id: {
        type: Sequelize.STRING
    },
    user_id: {
        type: Sequelize.STRING
    },
    cost: {
        type: Sequelize.STRING
    },
    heure: {
        type: Sequelize.DATE
    }
});

module.exports = Order;