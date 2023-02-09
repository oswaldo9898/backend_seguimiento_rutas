'use strict'
const { Router } = require('express');
const api = Router();
const usuariosController = require('../controllers/usuariosController');

api.post('/login', usuariosController.login);
api.post('/registro', usuariosController.registro);
api.get('/obtener_representante_libre/:cedula', usuariosController.obtener_representante_libre);
api.get('/obtener_representante_asignado/:cedulaEst', usuariosController.obtener_representante_asignado);
api.post('/registro_representante/:cedulaEst/:cedula', usuariosController.registro_representante);
api.delete('/eliminar_representante_asignado/:cedulaEst', usuariosController.eliminar_representante_asignado);
api.post('/registrar_id_activo/:cedula', usuariosController.registrar_id_activo);
api.post('/eliminar_id_activo/:cedula', usuariosController.eliminar_id_activo);
api.get('/obtener_usuario/:cedula', usuariosController.obtener_usuario);
api.post('/cambiar_password', usuariosController.cambiar_password);
api.delete('/eliminar_usuario_representante/:cedula', usuariosController.eliminar_usuario_representante);


module.exports = api;