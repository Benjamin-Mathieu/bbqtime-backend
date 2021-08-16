const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
    email: {
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

module.exports = User;