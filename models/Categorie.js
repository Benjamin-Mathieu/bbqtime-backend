const Sequelize = require('sequelize');
const db = require('../config/database');

const Categorie = db.define('categorie', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    libelle: {
        type: Sequelize.STRING,
        validate: {
            isAlpha: true
        }
    }
});

module.exports = Categorie;