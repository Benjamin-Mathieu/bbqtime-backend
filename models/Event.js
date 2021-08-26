const Sequelize = require('sequelize');
const db = require('../config/database');
const Plat = require('./Plat');
const User = require('./User');

const Event = db.define('event', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    // user_id: {
    //     type: Sequelize.INTEGER,
    //     references: {         // Event belongsTo User 1:1
    //         model: 'user',
    //         key: 'id'
    //     }
    // },
    name: {
        type: Sequelize.STRING,
        // validate: {
        //     isAlpha: true
        // }
    },
    password: {
        type: Sequelize.STRING,
        // validate: {
        //     isAlpha: true
        // }
    }
});

Event.belongsTo(User, { foreignKey: 'user_id' });
Event.hasMany(Plat, { foreignKey: 'event_id' });

// Event.associate = function(models) {
//     Event.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
// };

module.exports = Event;