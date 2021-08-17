const Sequelize = require('sequelize');
const db = require('../config/database');
const Event = require('./Event');

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    firstname: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.CHAR
    }
});

// User.hasMany(Event);

module.exports = User;