"use strict";
const app = require("./app");

///importar database
require("./database/conexion");

app.listen(app.get("port"), (error) => {
    if (error) {
        console.log(`Sucedió un error: ${error}`);
    } else {
        console.log(`Servidor corriendo en el puerto: ${app.get("port")}`);
    }
});
