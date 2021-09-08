const Sequelize = require('sequelize');
const db = require('../config/database');
const Plat = require('./Plat');
const User = require('./User');
const Categorie = require('./Categorie');

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
    address: {
        type: Sequelize.TEXT
    },
    city: {
        type: Sequelize.STRING
    },
    zipcode: {
        type: Sequelize.INTEGER
    },
    date: {
        type: Sequelize.DATE
    },
    description: {
        type: Sequelize.CHAR
    },
    photo_url: {
        type: Sequelize.CHAR
    },
    private: {
        type: Sequelize.BOOLEAN
    }
});

Event.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Event, { foreignKey: 'user_id' });



module.exports = Event;