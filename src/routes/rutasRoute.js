'use strict'
const { Router } = require('express');
const api = Router();
const rutasController = require('../controllers/rutaController');

api.post('/registro_ruta', rutasController.registro_ruta);
api.get('/lista_rutas', rutasController.lista_rutas);
api.get('/lista_rutas_conductor/:cedula', rutasController.lista_rutas_conductor);
api.delete('/eliminar_ruta/:idrutas', rutasController.eliminar_ruta);
api.get('/obtener_estudiantes_sin_ruta', rutasController.obtener_estudiantes_sin_ruta);
api.get('/obtener_estudiantes_ruta/:idrutas', rutasController.obtener_estudiantes_ruta);
api.delete('/eliminar_estudiantes_ruta/:cedula_est', rutasController.eliminar_estudiantes_ruta);
api.post('/registro_estudiante_ruta/:cedula_est/:idrutas', rutasController.registro_estudiante_ruta);
api.get('/cantidad_rutas', rutasController.cantidad_rutas);

module.exports = api;