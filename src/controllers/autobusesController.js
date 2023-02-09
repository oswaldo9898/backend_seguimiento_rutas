'use strict'
const util = require('util');
const connection = require('../database/conexion');
const query = util.promisify(connection.query).bind(connection);
var fs = require("fs");
var path = require('path');

const registro_autobus = async function(req, res) {
    try{
        var data = req.body;
        let sql1 = `Select * from autobuses where placa= ${connection.escape(data.placa)};`;
        const reg1 = await query(sql1);
        if(reg1==""){
            if(data.path != null){
                var name = data.path.split('/');
                var foto_name = name[6];
                data.path = foto_name;
                fs.writeFileSync('src/uploads/autobuses/'+data.path, new Buffer.from(data.imagen64, "base64"), function(err) {});
            }else{
                data.path = 'null';
            }
            let sql2 = `Insert into autobuses(marca,modelo,placa,foto) 
                values(${connection.escape(data.marca)},${connection.escape(data.modelo)},${connection.escape(data.placa)},${connection.escape(data.path)});`;
            const reg2 = await query(sql2);
            let sql4 = `Select * from autobuses where placa= ${connection.escape(data.placa)};`;
            const reg4 = await query(sql4);
            res.status(200).send({data:reg4[0],message:"Exito"});
        }else{
            res.status(401).send({data:reg1[0],message:"El número de placa ya está registrado"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}

const lista_autobuses = async function(req, res) {
    try{
        let sql = 'Select * from autobuses;';
        const reg = await query(sql);
        res.status(200).send(reg);
    }catch(error){
        res.status(401).send({message:error});
        console.log("error -> ", error)
    }    
}

const lista_autobuses_disponibles = async function(req, res) {
    try{
        let sql = `SELECT autobuses.* FROM autobuses 
        where not exists (select null from rutas where  autobuses.placa =  rutas.placa);`;
        const reg = await query(sql);
        res.status(200).send(reg);
    }catch(error){
        res.status(401).send({message:error});
        console.log("error -> ", error)
    }    
}

const editar_autobus = async function(req, res) {
    try{
        var data = req.body;
        let sql = `Select * from autobuses where idautobus = ${connection.escape(data.idautobus)};`;
        const reg= await query(sql);
        if(reg!=""){
            let sql1;
            if(data.path != null){
                var name = data.path.split('/');
                var foto_name = name[6];
                data.path = foto_name;
                fs.writeFileSync('src/uploads/autobuses/'+data.path, new Buffer.from(data.imagen64, "base64"), function(err) {});
                sql1 = `Update autobuses set marca = ${connection.escape(data.marca)}, modelo = ${connection.escape(data.modelo)}, placa = ${connection.escape(data.placa)}, foto = ${connection.escape(data.path)} where idautobus = ${connection.escape(data.idautobus)};`;
                eliminar_foto_backend(reg[0].foto);
            }else{
                sql1 = `Update autobuses set marca = ${connection.escape(data.marca)}, modelo = ${connection.escape(data.modelo)}, placa = ${connection.escape(data.placa)} where idautobus = ${connection.escape(data.idautobus)};`;
            }
            const reg1 = await query(sql1);
            let sql2= `Select * from autobuses where idautobus = ${connection.escape(data.idautobus)};`;
            const reg2 = await query(sql2);
            res.status(200).send({data:reg2[0],message:"Exito"});
        }else{
            res.status(401).send({data:reg[0],message:"No existe"});
        }
    }catch(error){
        res.status(401).send({message:error});
        console.log("error -> ", error)
    }
}

const eliminar_autobus = async function(req, res) {
    try{
        var idautobus = req.params['idautobus'];
        let sql1 = `Select * from autobuses where idautobus= ${connection.escape(idautobus)};`;
        const reg1 = await query(sql1);
        if(reg1!=""){
            let sql2 = `Delete from autobuses where idautobus = ${connection.escape(idautobus)};`;
            const reg2 = await query(sql2);
            eliminar_foto_backend(reg1[0].foto);
            res.status(200).send({data:reg2[0],message:"El registro ha sido eliminado"});
        }else{
            res.status(401).send({data:reg1[0],message:"Error"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}

const obtener_foto_autobus = async function(req, res){
    var img = req.params['img'];
    fs.stat('./src/uploads/autobuses/'+img, function(err){
        if(!err){
            let path_img = './src/uploads/autobuses/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './src/uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

function eliminar_foto_backend(foto){
    if(fs.existsSync('src/uploads/autobuses/'+foto)){
        fs.unlinkSync('src/uploads/autobuses/'+foto)
    } 
}

module.exports = {
    registro_autobus,
    lista_autobuses,
    lista_autobuses_disponibles,
    editar_autobus,
    obtener_foto_autobus,
    eliminar_autobus
}