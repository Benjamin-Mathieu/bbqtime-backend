const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING,
        // validate: {
        //     isAlpha: true
        // }
    },
    firstname: {
        type: Sequelize.STRING,
        // validate: {
        //     isAlpha: true
        // }
    },
    phone: {
        type: Sequelize.CHAR
    }
});

module.exports = User;