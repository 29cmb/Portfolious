const mysql = require('mysql')
require('dotenv').config()

const { dbHost, dbUsername, dbPassword, dbName, databasePort} = process.env

const sql = mysql.createPool({
    host            : dbHost,
    user            : dbUsername,
    password        : dbPassword,
    database        : dbName,
    port            : databasePort,
    connectionLimit : 1000,
    connectTimeout  : 1000 * 10,
    acquireTimeout  : 1000 * 10,
    timeout         : 1000 * 10,
})

module.exports = sql
