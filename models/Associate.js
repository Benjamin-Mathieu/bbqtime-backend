const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./User');

const Associate = db.define('associate_events', {
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
    event_id: {
        type: Sequelize.INTEGER,
        validate: {
            isInt: true
        }
    }
});

Associate.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Associate;