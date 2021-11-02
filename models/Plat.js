const Sequelize = require('sequelize');
const db = require('../config/database');

const Plat = db.define('plat', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    libelle: {
        type: Sequelize.STRING,
        validate: {
            isAlphanumeric: true
        }
    },
    photo_url: {
        type: Sequelize.STRING
    },
    stock: {
        type: Sequelize.BIGINT,
        validate: {
            isInt: true
        }
    },
    price: {
        type: Sequelize.DECIMAL,
        validate: {
            isDecimal: true
        }
    },
    description: {
        type: Sequelize.STRING,
        validate: {
            isAlphanumeric: true
        }
    }
});


module.exports = Plat;