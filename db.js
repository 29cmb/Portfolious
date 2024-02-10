const mysql = require('mysql')
require('dotenv').config()

const sql = mysql.createPool({
    host: process.env.dbHost,
    user: process.env.dbUsername,
    password: process.env.dbPassword,
    database: process.env.dbName,
    port: process.env.databasePort,
    connectionLimit: 10
})

module.exports = sql
