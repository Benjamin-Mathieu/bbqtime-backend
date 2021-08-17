const Sequelize = require('sequelize');
const db = require('../config/database');

const Categorie = db.define('categorie', {
    libelle: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE
    }
});

module.exports = Categorie;