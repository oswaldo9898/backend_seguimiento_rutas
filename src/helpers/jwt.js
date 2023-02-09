'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'ClaveDeAplicacionMobil'

exports.createToken = function(usuario){
    var payload = {
        sub: usuario.cedula,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        role: usuario.rol,
        email_validado: usuario.email_validado,
        iat: moment().unix()
    }
    return jwt.encode(payload,secret);
}