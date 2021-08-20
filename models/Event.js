const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./User');

const Event = db.define('event', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        references: {         // Event belongsTo User 1:1
            model: 'user',
            key: 'id'
        }
    },
    name: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
});

// Event.belongsTo(User);

// Event.associate = function(models) {
//     Event.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
// };

module.exports = Event;