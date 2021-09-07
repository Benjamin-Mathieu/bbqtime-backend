const Sequelize = require('sequelize');
const db = require('../config/database');
const Event = require('./Event');
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
    event_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'event',
            key: 'id'
        }
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
    },
    category_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'categorie',
            key: 'id'
        }
    }
});

// Plat.Categorie = Plat.belongsTo(Categorie, { foreignKey: 'category_id' });

module.exports = Plat;