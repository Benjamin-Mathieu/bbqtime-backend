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
        type: Sequelize.STRING
    },
    event_id: {
        type: Sequelize.INTEGER,
        references: {         // Plat belongsTo Event 1:1
            model: 'event',
            key: 'id'
        }
    },
    photo_url: {
        type: Sequelize.STRING
    },
    quantity: {
        type: Sequelize.BIGINT
    },
    price: {
        type: Sequelize.DECIMAL
    },
    category_id: {
        type: Sequelize.INTEGER,
        references: {         // Plat hasOne Categorie 1:1
            model: 'categorie',
            key: 'id'
        }
    }
});

// Plat.belongsTo(Event);
// Plat.hasOne(Categorie);


module.exports = Plat;