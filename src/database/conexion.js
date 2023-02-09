"use strict";
const mysql = require("mysql"),
    data = require("./datosConexion2.json"),
    objectConnection = {
        host: data.mysql.host,
        port: data.mysql.port,
        user: data.mysql.user,
        password: data.mysql.password,
        database: data.mysql.database,
    };

const pool = mysql.createPool(objectConnection);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error("Database connection was closed.");
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
            console.error("Database has too many connections.");
        }
        if (err.code === "ECONNREFUSED") {
            console.log(err)
            console.error("Database connection was refused.");
        }else {
            console.log(err)
            console.log("error");
        }
    }

    if (connection) {
        connection.release();
        console.log("Base de datos corriendo en el puerto: 3306");
    }

    return;
});

module.exports = pool;
