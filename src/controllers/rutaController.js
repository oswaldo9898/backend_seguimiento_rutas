'use strict'
const util = require('util');
const connection = require('../database/conexion');
const query = util.promisify(connection.query).bind(connection);

const registro_ruta = async function(req, res) {
    try{
        var data = req.body;
        let sql1 = `Select * from rutas where placa= ${connection.escape(data.placa)};`;
        const reg1 = await query(sql1);
        if(reg1==""){
            let sql2 = `Insert into rutas(cedula,placa,nombre) 
                values(${connection.escape(data.cedula)},${connection.escape(data.placa)},${connection.escape(data.nombre)});`;
            const reg2 = await query(sql2);
            let sql4 = `Select * from rutas where placa= ${connection.escape(data.placa)};`;
            const reg4 = await query(sql4);
            res.status(200).send({data:reg4[0],message:"Exito"});
        }else{
            res.status(401).send({data:reg1[0],message:"El número de placa ya está registrado"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}

const lista_rutas = async function(req, res) {
    try{
        let sql = 'Select * from rutas;';
        const reg = await query(sql);
        res.status(200).send(reg);
    }catch(error){
        res.status(401).send({message:error});
        console.log("error -> ", error)
    }    
}

const lista_rutas_conductor = async function(req, res) {
    try{
        var cedula = req.params['cedula'];
        let sql = `Select * from rutas where cedula = ${connection.escape(cedula)};`;
        const reg = await query(sql);
        res.status(200).send(reg);
    }catch(error){
        let sql = `Select * from rutas;`;
        const reg = await query(sql);
        res.status(200).send(reg);
        console.log("error -> ", error)
    }    
}

const eliminar_ruta = async function(req, res) {
    try{
        var idrutas = req.params['idrutas'];
        let sql1 = `Select * from rutas where idrutas= ${connection.escape(idrutas)};`;
        const reg1 = await query(sql1);
        if(reg1!=""){
            let sql2 = `Delete from rutas where idrutas = ${connection.escape(idrutas)};`;
            const reg2 = await query(sql2);
            res.status(200).send({data:reg2[0],message:"El registro ha sido eliminado"});
        }else{
            res.status(401).send({data:reg1[0],message:"Error"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}

const obtener_estudiantes_sin_ruta = async function(req, res) {
    try{
        let sql = `select estudiantes.* from estudiantes
        where not exists(select null from ruta_estudiante where estudiantes.cedula_est = ruta_estudiante.cedula_est);`;
        const reg = await query(sql);
        res.status(200).send(reg);
    }catch(error){
        console.log("error -> ", error)
    }
}

const obtener_estudiantes_ruta = async function(req, res) {
    try{
        var idrutas = req.params['idrutas'];
        let sql = `Select estudiantes.*, representante_estudiante.cedula
        from estudiantes
        RIGHT JOIN ruta_estudiante on estudiantes.cedula_est = ruta_estudiante.cedula_est
        RIGHT JOIN representante_estudiante on estudiantes.cedula_est = representante_estudiante.cedula_est
        where ruta_estudiante.idrutas = ${connection.escape(idrutas)}`;
        const reg = await query(sql);
        res.status(200).send(reg);
    }catch(error){
        console.log("error -> ", error)
    }
}


const eliminar_estudiantes_ruta = async function(req, res) {
    try{
        var cedula_est = req.params['cedula_est'];
        let sql = `Select * from estudiantes where cedula_est = ${connection.escape(cedula_est)}`;
        const reg = await query(sql);
        if(reg!=""){
            let sql2 = `Delete from ruta_estudiante where cedula_est = ${connection.escape(cedula_est)};`;
            const reg2 = await query(sql2);
            res.status(200).send({data:reg2[0],message:"El registro ha sido eliminado"});
        }else{
            res.status(401).send({data:reg1[0],message:"Error"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}

const registro_estudiante_ruta = async function(req, res) {
    try{
        var cedula_est = req.params['cedula_est'];
        var idrutas = req.params['idrutas'];
        let sql = `Select * from ruta_estudiante where cedula_est= ${connection.escape(cedula_est)} and idrutas = ${connection.escape(idrutas)};`;
        const reg = await query(sql);
        if(reg==""){
            let sql2 = `Insert into ruta_estudiante(idrutas,cedula_est) 
                values(${connection.escape(idrutas)},${connection.escape(cedula_est)});`;
            const reg2 = await query(sql2);
            let sql4 = `Select * from ruta_estudiante where cedula_est= ${connection.escape(cedula_est)} and idrutas = ${connection.escape(idrutas)};`;
            const reg4 = await query(sql4);
            res.status(200).send({data:reg4[0],message:"Exito"});
        }else{
            res.status(401).send({data:reg1[0],message:"El número de placa ya está registrado"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}

const cantidad_rutas = async function(req, res) {
    try{
        let sql = `Select count(*) as cantidad from rutas;`;
        const reg = await query(sql);
        res.status(200).send({data:reg[0].cantidad});
    }catch(error){
        console.log("error -> ", error)
    }
}

module.exports = {
    registro_ruta,
    lista_rutas,
    lista_rutas_conductor,
    eliminar_ruta,
    obtener_estudiantes_sin_ruta,
    obtener_estudiantes_ruta,
    eliminar_estudiantes_ruta,
    registro_estudiante_ruta,
    cantidad_rutas
}