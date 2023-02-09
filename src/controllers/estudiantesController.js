'use strict'
const util = require('util');
const connection = require('../database/conexion');
const query = util.promisify(connection.query).bind(connection);
var fs = require("fs");
var path = require('path');

const registro_estudiante = async function(req, res) {
    try{
        var data = req.body;
        let sql1 = `Select * from estudiantes where cedula_est= ${connection.escape(data.cedula_est)};`;
        const reg1 = await query(sql1);
        if(reg1==""){
            if(data.path != null){
                var name = data.path.split('/');
                var foto_name = name[6];
                data.path = foto_name;
                fs.writeFileSync('src/uploads/estudiantes/'+data.path, new Buffer.from(data.imagen64, "base64"), function(err) {});
            }else{
                data.path = 'null';
            }
            let sql2 = `Insert into estudiantes(cedula_est,nombres_est,apellidos_est,foto_est, latitud, longitud) 
                values(${connection.escape(data.cedula_est)},${connection.escape(data.nombres_est)},${connection.escape(data.apellidos_est)},${connection.escape(data.path)},${connection.escape(data.latitud)},${connection.escape(data.longitud)});`;
            const reg2 = await query(sql2);
            let sql4 = `Select * from estudiantes where cedula_est= ${connection.escape(data.cedula_est)};`;
            const reg4 = await query(sql4);
            res.status(200).send({data:reg4[0],message:"Exito"});
        }else{
            res.status(401).send({data:reg1[0],message:"El número de cédula ya está registrado"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}

const lista_estudiantes = async function(req, res) {
    try{
        let sql = 'Select * from estudiantes;';
        const reg = await query(sql);
        res.status(200).send(reg);
    }catch(error){
        res.status(401).send({message:error});
        console.log("error -> ", error)
    }    
}

const registro_estudiante_direccion = async function(req, res) {
    try{
        var data = req.body;
        let sql1 = `Select * from estudiantes where cedula_est= ${connection.escape(data.cedula_est)};`;
        const reg1 = await query(sql1);
        if(reg1!=""){
            let sql2 = `Update estudiantes set latitud = ${connection.escape(data.latitud)}, longitud = ${connection.escape(data.longitud)} where cedula_est = ${connection.escape(data.cedula_est)};`;
            const reg2 = await query(sql2);
            res.status(200).send({data:reg1[0],message:"Exito"});
        }else{
            res.status(401).send({data:reg1[0],message:"Error"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}

const editar_estudiante = async function(req, res) {
    try{
        let sql1 ;
        var data = req.body;
        if(data.path != null){
            var name = data.path.split('/');
            var foto_name = name[6];
            data.path = foto_name;
            fs.writeFileSync('src/uploads/estudiantes/'+data.path, new Buffer.from(data.imagen64, "base64"), function(err) {});
            sql1 = `Update estudiantes set nombres_est = ${connection.escape(data.nombres_est)}, apellidos_est = ${connection.escape(data.apellidos_est)}, foto_est = ${connection.escape(data.path)} where cedula_est = ${connection.escape(data.cedula_est)};`;
        }else{
            sql1 = `Update estudiantes set nombres_est = ${connection.escape(data.nombres_est)}, apellidos_est = ${connection.escape(data.apellidos_est)} where cedula_est = ${connection.escape(data.cedula_est)};`;
        }
        const reg2 = await query(sql1);
        let sql4 = `Select * from estudiantes where cedula_est= ${connection.escape(data.cedula_est)};`;
        const reg4 = await query(sql4);
        res.status(200).send({data:reg4[0],message:"Exito"});
    }catch(error){
        res.status(401).send({message:error});
        console.log("error -> ", error)
    }
}

const eliminar_estudiante = async function(req, res) {
    try{
        var cedula = req.params['cedula'];
        let sql1 = `Select * from estudiantes where cedula_est= ${connection.escape(cedula)};`;
        const reg1 = await query(sql1);
        if(reg1!=""){
            let sql2 = `Delete from estudiantes where cedula_est = ${connection.escape(cedula)};`;
            const reg2 = await query(sql2);
            res.status(200).send({data:reg2[0],message:"El registro ha sido eliminado"});
        }else{
            res.status(401).send({data:reg1[0],message:"Error"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}

const obtener_foto_estudiante = async function(req, res){
    var img = req.params['img'];
    fs.stat('./src/uploads/estudiantes/'+img, function(err){
        if(!err){
            let path_img = './src/uploads/estudiantes/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './src/uploads/default_persona.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

const cantidad_estudiantes = async function(req, res) {
    try{
        let sql = `Select count(*) as cantidad from estudiantes;`;
        const reg = await query(sql);
        res.status(200).send({data:reg[0].cantidad});
    }catch(error){
        console.log("error -> ", error)
    }
}

const lista_estudiantes_representante = async function(req, res) {
    try{
        var cedula = req.params['cedula'];
        let sql = `Select estudiantes.* from estudiantes
        RIGHT JOIN representante_estudiante on estudiantes.cedula_est = representante_estudiante.cedula_est
        RIGHT JOIN usuarios on usuarios.cedula = representante_estudiante.cedula
        where usuarios.cedula = ${connection.escape(cedula)}`;
        const reg = await query(sql);
        res.status(200).send(reg);
    }catch(error){
        res.status(401).send({message:error});
        console.log("error -> ", error)
    }  
}

const obtener_idruta_estudiante = async function(req, res) {
    try{
        var cedula_est = req.params['cedula_est'];
        let sql = `Select rutas.* from rutas
        inner join ruta_estudiante on rutas.idrutas = ruta_estudiante.idrutas
        where  ruta_estudiante.cedula_est = ${connection.escape(cedula_est)};`;
        const reg = await query(sql);
        res.status(200).send({data:reg[0],message:"Exito"});
    }catch(error){
        res.status(401).send({message:error});
        console.log("error -> ", error)
    }
}

module.exports = {
    registro_estudiante,
    lista_estudiantes,
    registro_estudiante_direccion,
    editar_estudiante,
    obtener_foto_estudiante,
    eliminar_estudiante,
    cantidad_estudiantes,
    lista_estudiantes_representante,
    obtener_idruta_estudiante
}