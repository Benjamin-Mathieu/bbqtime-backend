const Sequelize = require('sequelize');
const db = require('../config/database');
const Plat = require('../models/Plat');

const OrderPlats = db.define('orders_plats', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    plat_id: {
        type: Sequelize.INTEGER,
        validate: {
            isInt: true
        }
    },
    order_id: {
        type: Sequelize.INTEGER,
        validate: {
            isInt: true
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
Plat.hasMany(OrderPlats, { foreignKey: 'plat_id' });

module.exports = OrderPlats;