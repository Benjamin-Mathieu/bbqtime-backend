const Sequelize = require('sequelize');
const db = require('../config/database');
const Event = require('./Event');
const OrderPlats = require('./OrderPlats');
const User = require('./User');

const Order = db.define('order', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    event_id: {
        type: Sequelize.INTEGER,
        validate: {
            isInt: true
        }
    },
    user_id: {
        type: Sequelize.INTEGER,
        validate: {
            isInt: true
        }
    },
    cost: {
        type: Sequelize.DECIMAL,
        validate: {
            isDecimal: true
        }
    },
    heure: {
        type: Sequelize.DATE,
        validate: {
            isDate: true
        }
    },
    status: {
        type: Sequelize.TINYINT,
        validate: {
            isInt: true
        }
    }
});

Order.belongsTo(Event, { foreignKey: 'event_id' });
Event.hasMany(Order, { foreignKey: 'event_id' });

Order.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Order, { foreignKey: 'user_id' });

OrderPlats.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(OrderPlats, { foreignKey: 'order_id' });

module.exports = Order;