const { Sequelize } = require('sequelize');

module.exports = new Sequelize("bbqtime", "root", "root", { dialect: "mysql", host: "localhost" });