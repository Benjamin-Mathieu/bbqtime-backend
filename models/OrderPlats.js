const Sequelize = require('sequelize');
const db = require('../config/database');
const Plat = require('../models/Plat');
const Order = require('../models/Order');

const OrderPlats = db.define('orders_plats', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    plat_id: {
        type: Sequelize.INTEGER,
        references: {         // OrderPlats belongsTo Plat 1:1
            model: 'plat',
            key: 'id'
        }
    },
    order_id: {
        type: Sequelize.INTEGER,
        references: {         // OrderPlats belongsTo Order 1:1
            model: 'order',
            key: 'id'
        }
    },
    quantity: {
        type: Sequelize.BIGINT,
        validate: {
            isNumeric: true
        }
    }
});

OrderPlats.belongsTo(Plat, { foreignKey: 'plat_id' });

module.exports = OrderPlats;