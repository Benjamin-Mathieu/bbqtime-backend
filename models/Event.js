const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./User');
const Associate = require('./Associate');

const Event = db.define('event', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.TEXT
    },
    city: {
        type: Sequelize.STRING
    },
    zipcode: {
        type: Sequelize.INTEGER
    },
    date: {
        type: Sequelize.DATE
    },
    description: {
        type: Sequelize.CHAR
    },
    photo_url: {
        type: Sequelize.CHAR
    },
    private: {
        type: Sequelize.BOOLEAN
    },
    qrcode: {
        type: Sequelize.TEXT
    }
},
    { paranoid: true }
);

Event.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Event, { foreignKey: 'user_id' });

Associate.belongsTo(Event, { foreignKey: 'event_id' });
Event.hasMany(Associate, { foreignKey: 'event_id' });

module.exports = Event;