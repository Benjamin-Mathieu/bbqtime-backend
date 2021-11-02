const { Sequelize, DataTypes } = require('sequelize');
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
        type: DataTypes.STRING,
        validate: {
            isAlpha: true
        }
    },
    password: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING,
        validate: {
            isAlpha: true
        }
    },
    zipcode: {
        type: DataTypes.STRING,
        validate: {
            isNumeric: true
        }
    },
    date: {
        type: DataTypes.DATE,
        validate: {
            isDate: true
        }
    },
    description: {
        type: DataTypes.CHAR,
        validate: {
            isAlpha: true
        }
    },
    photo_url: {
        type: DataTypes.INTEGER,
        validate: {
            isUrl: true
        }
    },
    private: {
        type: DataTypes.BOOLEAN,
        validate: {
            isBoolean: true
        }
    },
    qrcode: {
        type: DataTypes.TEXT
    }
},
    { paranoid: true }
);

Event.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Event, { foreignKey: 'user_id' });

Associate.belongsTo(Event, { foreignKey: 'event_id' });
Event.hasMany(Associate, { foreignKey: 'event_id' });

module.exports = Event;