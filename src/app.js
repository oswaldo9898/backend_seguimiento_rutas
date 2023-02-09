'use strict'
require('dotenv').config();
var bodyparser = require('body-parser');
const express = require('express');
const port = (process.env.PORT || 3000);

const app = express();

//RUTAS
var usuarios_route = require('./routes/usuariosRoute');
var autobuses_route = require('./routes/autobusesRoute');
var estudiantes_route = require('./routes/estudiantesRoute');
var conductores_route = require('./routes/conductoresRoute');
var rutas_route = require('./routes/rutasRoute');
var pushNotificaciones_route = require('./routes/notificacionesRoute');

//SETINGS
app.set('port', port);


//MIDDLEWARS
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({limit: '50mb'}));

//Permiso para conectar el backend y frontend
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS, PATCH');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS, PATCH');
    next();
});

app.use(bodyparser.urlencoded({limit: '50mb',extended: true}));
app.use(bodyparser.json({limit: '50mb'}))

//ROUTES
app.use('/api', usuarios_route);
app.use('/api', autobuses_route);
app.use('/api', estudiantes_route);
app.use('/api', conductores_route);
app.use('/api', rutas_route);
app.use('/api', pushNotificaciones_route);

module.exports = app;