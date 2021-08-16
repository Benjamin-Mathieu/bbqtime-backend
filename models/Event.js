const Sequelize = require('sequelize');
const db = require('../config/database');

const Event = db.define('event', {
    user_id: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
});

module.exports = Event;