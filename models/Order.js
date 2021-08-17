const Sequelize = require('sequelize');
const db = require('../config/database');

const Order = db.define('order', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
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