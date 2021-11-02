const Sequelize = require('sequelize');
const db = require('../config/database');
const Plat = require('./Plat');
const Event = require('./Event');

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
            isAlphanumeric: true
        }
    }
});

Plat.belongsTo(Categorie, { foreignKey: 'category_id' });
Categorie.hasMany(Plat, { foreignKey: 'category_id' });

Categorie.belongsTo(Event, { foreignKey: 'event_id' });
Event.hasMany(Categorie, { foreignKey: 'event_id' });

module.exports = Categorie;