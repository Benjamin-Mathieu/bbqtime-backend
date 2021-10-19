const Sequelize = require('sequelize');
const db = require('../config/database');

const Associate = db.define('associate_events', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
    },
    event_id: {
        type: Sequelize.INTEGER,
    }
});

module.exports = Associate;