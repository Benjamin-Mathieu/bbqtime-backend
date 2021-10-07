const Sequelize = require('sequelize');
const db = require('../config/database');

const ResetPasswords = db.define('reset_passwords', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
    },
    code: {
        type: Sequelize.INTEGER
    }
});

module.exports = ResetPasswords;