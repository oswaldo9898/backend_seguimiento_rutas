'use strict'
const { Router } = require('express');
const api = Router();
const pushNotificacionesController = require("../controllers/pushNotificacionesController");

// api.get("/enviar_notificacion_todos/:mensaje", pushNotificacionesController.enviar_notificacion_todos);
api.post("/enviar_notificacion_dispotivo/:mensaje", pushNotificacionesController.enviar_notificacion_dispotivo);
api.post("/enviar_notificacion_rutas/:mensaje", pushNotificacionesController.enviar_notificacion_rutas);

module.exports = api;