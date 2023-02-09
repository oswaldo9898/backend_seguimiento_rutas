'use strict'
const util = require('util');
const connection = require('../database/conexion');
const query = util.promisify(connection.query).bind(connection);
const { encrypt, compare} = require('../helpers/handleBcrypt');
const bcrypt = require('bcryptjs');
const { createToken } = require('../helpers/jwt');

const login = async function(req, res) {
    try{
        var data = req.body;
        let sql = `Select * from usuarios where email= ${connection.escape(data.email)};`;
        const reg = await query(sql);
        if(reg != ""){
            const verificarPassword = await bcrypt.compare(data.password,reg[0].password,async function(err, check){
                if(check){
                    res.status(200).send({
                        data:reg[0],
                        token: createToken(reg[0]),
                        message: 'Inicio de sesión correcto'
                    });
                }else{
                    res.status(401).send({reg:[],message:"El correo electrónico o contraseña son incorrectos"});
                }
            });
        }else{
            res.status(401).send({reg,message:"El correo electrónico o contraseña son incorrectos"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}

const registro = async function(req, res) {
    try{
        var data = req.body;
        let sql1 = `Select * from usuarios where cedula = ${connection.escape(data.cedula)}`;
        const reg1 = await query(sql1);
        if(reg1==""){
            let sql2 = `Select * from usuarios where email = ${connection.escape(data.email)}`;
            const reg2 = await query(sql2);
            if(reg2==""){
                const passwordHash = await encrypt(data.password);
                let sql3 = `Insert into usuarios(cedula,nombres,apellidos,email,password,rol,email_validado) 
                values(${connection.escape(data.cedula)},${connection.escape(data.nombres)},${connection.escape(data.apellidos)},${connection.escape(data.email)},${connection.escape(passwordHash)},${connection.escape(data.rol)},'FALSE');`;
                const reg3 = await query(sql3);
                let sql4 = `Select * from usuarios where email= ${connection.escape(data.email)};`;
                const reg4 = await query(sql4);
                res.status(200).send({
                    data: reg4[0],
                    message:"Exito"
                });
            }else{
            res.status(401).send({reg2,message:"El correo electrónico ya está registrado"});
            }            
        }else{
            res.status(401).send({reg1,message:"El número de cédula ya está registrado"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}


const obtener_representante_libre = async function(req, res) {
    try{
        let sql =``;
        var cedula = req.params['cedula'];
        if(cedula == "vacio"){
            sql = `select usuarios.* from usuarios 
                where usuarios.rol = 'REPRESENTANTE';`;
        }else{
            sql = `select usuarios.* from usuarios 
            where not (usuarios.cedula = ${connection.escape(cedula)}) and usuarios.rol = 'REPRESENTANTE';`;
        }
        const reg = await query(sql);
        res.status(200).send(reg);
    }catch(error){
        console.log("error -> ", error)
    }
}

const obtener_representante_asignado = async function(req, res) {
    try{
        var cedulaEst = req.params['cedulaEst'];
        let sql = `Select usuarios.* 
        from usuarios
        RIGHT JOIN representante_estudiante on usuarios.cedula = representante_estudiante.cedula
        where representante_estudiante.cedula_est = ${connection.escape(cedulaEst)};`;
        const reg = await query(sql);
        res.status(200).send(reg);
    }catch(error){
        console.log("error -> ", error)
    }
}

const registro_representante = async function(req, res) {
    try{
        var cedulaEst = req.params['cedulaEst'];
        var cedula = req.params['cedula'];
        let sql = `Select * from representante_estudiante where cedula_est= ${connection.escape(cedulaEst)}`;
        const reg = await query(sql);
        if(reg==""){
            let sql2 = `Insert into representante_estudiante(cedula_est, cedula) 
                values(${connection.escape(cedulaEst)},${connection.escape(cedula)});`;
            const reg2 = await query(sql2);
            let sql4 = `Select * from representante_estudiante where cedula_est= ${connection.escape(cedulaEst)} and cedula = ${connection.escape(cedula)};`;
            const reg4 = await query(sql4);
            res.status(200).send({data:reg4[0],message:"Exito"});
        }else{
            let sql3 = `Update representante_estudiante set cedula = ${connection.escape(cedula)} where cedula_est=${connection.escape(cedulaEst)};`;
            const reg4 = await query(sql3);
            res.status(200).send({data:reg[0],message:"Exito"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}

const eliminar_representante_asignado = async function(req, res) {
    try{
        var cedulaEst = req.params['cedulaEst'];
        let sql = `Select * from representante_estudiante where cedula_est= ${connection.escape(cedulaEst)}`;
        const reg = await query(sql);
        if(reg!=""){
            let sql2 = `Delete from representante_estudiante where cedula_est = ${connection.escape(cedulaEst)};`;
            const reg2 = await query(sql2);
            res.status(200).send({data:reg2[0],message:"El registro ha sido eliminado"});
        }else{
            res.status(401).send({data:reg1[0],message:"Error"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}

const registrar_id_activo = async function(req, res) {
    try{
        var cedula = req.params['cedula'];
        var id = req.body.id;
        let sql = `Select * from usuarios where cedula= ${connection.escape(cedula)}`;
        const reg = await query(sql);
        if(reg!=""){
            let sql3 = `Update usuarios set activo = ${connection.escape(id)} where cedula=${connection.escape(cedula)};`;
            const reg4 = await query(sql3);
            res.status(200).send({data:reg[0],message:"Exito"});
        }else{
            res.status(401).send({data:reg1[0],message:"Error"});
        }
    }catch(error){
        console.log("error -> ", error)
    }

}

const eliminar_id_activo = async function(req, res) {
    try{
        var cedula = req.params['cedula'];
        let sql = `Select * from usuarios where cedula= ${connection.escape(cedula)}`;
        const reg = await query(sql);
        if(reg!=""){
            let sql3 = `Update usuarios set activo = '' where cedula=${connection.escape(cedula)};`;
            const reg4 = await query(sql3);
            res.status(200).send({data:reg[0],message:"Exito"});
        }else{
            res.status(401).send({data:reg1[0],message:"Error"});
        }
    }catch(error){
        console.log("error -> ", error)
    }

}

const obtener_usuario = async function(req, res) {
    try{
        var cedula = req.params['cedula'];
        let sql = `Select * 
        from usuarios where cedula = ${connection.escape(cedula)};`;
        const reg = await query(sql);
        res.status(200).send({data:reg[0],message:"Exito"});
    }catch(error){
        console.log("error -> ", error)
    }
}

const cambiar_password = async function(req, res) {
    try{
        var data = req.body;
        let sql = `Select usuarios.cedula, usuarios.nombres, usuarios.apellidos, usuarios.email, usuarios.rol, usuarios.password from usuarios where cedula= ${connection.escape(data.cedula)};`;
        const reg = await query(sql);
        if(reg != ""){
            const verificarPassword = await bcrypt.compare(data.passwordAnterior,reg[0].password,async function(err, check){
                if(check){
                    const passwordHash = await encrypt(data.passwordNueva);
                    let sql2 = `Update usuarios set password = ${connection.escape(passwordHash)} where cedula = ${connection.escape(data.cedula)};`
                    const reg2 = await query(sql2);
                    res.status(200).send({
                        data:reg[0],
                        token:'.................',
                        message: 'Exito'
                    });
                }else{
                    res.status(401).send({
                        data:reg[0],
                        token:'.................',
                        message: 'La contraseña es incorrecta'
                    });
                }
            });
        }else{
            res.status(401).send({
                data:reg[0],
                token:'.................',
                message: 'No existe el usuario'
            });
        }
    }catch(error){
        console.log("error -> ", error)
    }
}


const eliminar_usuario_representante = async function(req, res) {
    try{
        var cedula = req.params['cedula'];
        let sql = `Select * from usuarios where cedula= ${connection.escape(cedula)}`;
        const reg = await query(sql);
        if(reg!=""){
            let sql2 = `Delete from usuarios where cedula = ${connection.escape(cedula)};`;
            const reg2 = await query(sql2);
            res.status(200).send({data:reg2[0],message:"El registro ha sido eliminado"});
        }else{
            res.status(401).send({data:reg1[0],message:"Error"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}

module.exports = {
    login,
    registro,
    obtener_representante_libre,
    obtener_representante_asignado,
    registro_representante,
    eliminar_representante_asignado,
    registrar_id_activo,
    eliminar_id_activo,
    obtener_usuario,
    cambiar_password,
    eliminar_usuario_representante
}
