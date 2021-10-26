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
        references: {         // Order belongsTo Event 1:1
            model: 'event',
            key: 'id'
        }
    },
    user_id: {
        type: Sequelize.INTEGER,
        references: {         // Order belongsTo User 1:1
            model: 'user',
            key: 'id'
        }
    },
    cost: {
        type: Sequelize.STRING,
        // validate: {
        //     isDecimal: true
        // }
    },
    heure: {
        type: Sequelize.DATE,
        // validate: {
        //     isAfter: true
        // }
    },
    status: {
        type: Sequelize.TINYINT
    }
});

Order.belongsTo(Event, { foreignKey: 'event_id' });
Event.hasMany(Order, { foreignKey: 'event_id' });

Order.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Order, { foreignKey: 'user_id' });

OrderPlats.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(OrderPlats, { foreignKey: 'order_id' });

module.exports = Order;