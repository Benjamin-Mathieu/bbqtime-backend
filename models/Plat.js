const Sequelize = require('sequelize');
const db = require('../config/database');
const Categorie = require('./Categorie');

const Plat = db.define('plat', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    libelle: {
        type: Sequelize.STRING,
        // validate: {
        //     isAlpha: true
        // }
    },
    photo_url: {
        type: Sequelize.STRING
    },
    quantity: {
        type: Sequelize.BIGINT,
        // validate: {
        //     isNumeric: true
        // }
    },
    price: {
        type: Sequelize.DECIMAL,
        // validate: {
        //     isDecimal: true
        // }
    },
    description: {
        type: Sequelize.STRING
    }
});


module.exports = Plat;