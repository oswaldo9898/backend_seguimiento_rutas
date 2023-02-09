'use strict'
const util = require('util');
const connection = require('../database/conexion');
const query = util.promisify(connection.query).bind(connection);
const {ONE_SIGNAL_CONFIG} = require("../app.config");
const pushNotificacionesService = require("../service/pushNotificaciones.service");

async function enviar_notificacion_todos(req, res, next){
    var mensaje = req.params['mensaje'];
    var message = {
        app_id: ONE_SIGNAL_CONFIG.APP_ID,
        contents: {"en": mensaje},
        included_segments:["All"],
        content_available: true,
        small_icon: "airport_shuttle_outlined",
        data: {
            pushTitle: "CUSTOM NOTIFICATION"
        }
    };

    pushNotificacionesService.SendNotification(message, (error, results)=> {
        if(error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
};


async function enviar_notificacion_dispotivo (req, res, next) {
    var mensaje = req.params['mensaje'];
    var cedula = req.body.cedula;    
    let sql1 = `Select * from usuarios where cedula= ${connection.escape(cedula)};`;
    const reg1 = await query(sql1);
    if(reg1!=""){
        if (reg1[0].activo != null){
            var message = {
                app_id: ONE_SIGNAL_CONFIG.APP_ID,
                contents: {"es": mensaje},
                included_segments:["included_player_ids"],
                heading: "Notificación",
                include_player_ids: [reg1[0].activo],
                content_available: true,
                small_icon: "airport_shuttle_outlined",
                data: {
                    pushTitle: "CUSTOM NOTIFICATION"
                }
            };
            pushNotificacionesService.SendNotification(message, (error, results)=> {
                if(error) {
                    return next(error);
                }
                return res.status(200).send({
                    message: "Success",
                    data: results,
                });
            });
        }else{
            res.status(200).send({data:reg1[0],message:"Exito"});
        }
    }
};

async function enviar_notificacion_rutas (req, res, next) {
    var mensaje = req.params['mensaje'];
    var ruta = req.body.ruta;
    let sql1 = `Select usuarios.* 
        from usuarios
        RIGHT JOIN representante_estudiante on representante_estudiante.cedula = usuarios.cedula
        RIGHT JOIN estudiantes on representante_estudiante.cedula_est = estudiantes.cedula_est
        RIGHT JOIN ruta_estudiante on ruta_estudiante.cedula_est = estudiantes.cedula_est
        where ruta_estudiante.idrutas = ${connection.escape(ruta)};`;
    const reg1 = await query(sql1);
    if(reg1 != ""){
        reg1.forEach(element => {
            if (element.activo != null){
                var message = {
                    app_id: ONE_SIGNAL_CONFIG.APP_ID,
                    contents: {"es": mensaje},
                    heading: "Notificación",
                    included_segments:["included_player_ids"],
                    include_player_ids: [element.activo],
                    content_available: true,
                    small_icon: "airport_shuttle_outlined",
                    data: {
                        pushTitle: "CUSTOM NOTIFICATION"
                    }
                };
                pushNotificacionesService.SendNotification(message, (error, results)=> {
                    if(error) {
                        return next(error);
                    }
                    // return res.status(200).send({
                    //     message: "Success",
                    //     data: results,
                    // });
                });
            }
        });
        res.status(200).send({data:reg1[0],message:"Exito"});
    }
}

module.exports = {
    enviar_notificacion_dispotivo,
    enviar_notificacion_todos,
    enviar_notificacion_rutas
}
