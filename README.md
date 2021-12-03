# BBQ Time API

## Project setup
 `npm install`

Add file "database.js" in "config" folder and add :
`
const { Sequelize } = require('sequelize');`
`module.exports = new Sequelize("table_name", "username_db", "password_db", {`
 `dialect: "type_db",`
  `host: "host_db" })`

## Run API

- `npm start` or `nodemon ip_of_your_choice`

## Database SQL 
[Download](https://drive.google.com/file/d/1dUXeOzGpG8bPb2EAVVT-M2WCRmhcbJSI/view)
