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
        validate: {
            isInt: true
        }
    },
    code: {
        type: Sequelize.INTEGER,
        validate: {
            isInt: true
        }
    }
});

module.exports = ResetPasswords;