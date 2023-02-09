'use strict'
const { Router } = require('express');
const api = Router();
const conductoresController = require('../controllers/conductoresController');

api.post('/registro_conductor', conductoresController.registro_conductor);
api.get('/lista_conductores', conductoresController.lista_conductores);
api.get('/lista_conductores_disponibles', conductoresController.lista_conductores_disponibles);
api.delete('/eliminar_conductor/:cedula', conductoresController.eliminar_conductor);
api.put('/editar_conductor', conductoresController.editar_conductor);
api.get('/obtener_foto_conductor/:img', conductoresController.obtener_foto_conductor);

module.exports = api;