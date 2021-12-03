const { Sequelize } = require('sequelize');

module.exports = new Sequelize("table_name", "username_db", "password_db", { dialect: "type_db", host: "host_db" })