'use strict'
const util = require('util');
const connection = require('../database/conexion');
const query = util.promisify(connection.query).bind(connection);
const { encrypt, compare} = require('../helpers/handleBcrypt');
const bcrypt = require('bcryptjs');
var fs = require("fs");
var path = require('path');

const registro_conductor = async function(req, res) {
    try{
        var data = req.body;
        let sql1 = `Select * from usuarios where cedula = ${connection.escape(data.cedula)}`;
        const reg1 = await query(sql1);
        if(reg1==""){
            let sql2 = `Select * from usuarios where email = ${connection.escape(data.email)}`;
            const reg2 = await query(sql2);
            if(reg2==""){
                if(data.path != null){
                    var name = data.path.split('/');
                    var foto_name = name[6];
                    data.path = foto_name;
                    fs.writeFileSync('src/uploads/conductores/'+data.path, new Buffer.from(data.imagen64, "base64"), function(err) {});
                }else{
                    data.path = 'null';
                }
                const passwordHash = await encrypt(data.password);
                let sql3 = `Insert into usuarios(cedula,nombres,apellidos,email,password,rol,email_validado) 
                values(${connection.escape(data.cedula)},${connection.escape(data.nombres)},${connection.escape(data.apellidos)},${connection.escape(data.email)},${connection.escape(passwordHash)},${connection.escape(data.rol)},'FALSE');`;
                const reg3 = await query(sql3);

                let sql4 =`Insert into conductores(cedula_con,foto_con) 
                values(${connection.escape(data.cedula)},${connection.escape(data.path)});`;
                const reg4 = await query(sql4);

                let sql5 = `Select * from usuarios where email= ${connection.escape(data.email)};`;
                const reg5 = await query(sql5);
                res.status(200).send({
                    data: reg5[0],
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

const lista_conductores = async function(req, res) {
    try{
        let sql = `select usuarios.cedula, usuarios.nombres, usuarios.apellidos, usuarios.email, usuarios.rol, conductores.foto_con 
        from usuarios
        inner join conductores where usuarios.cedula = conductores.cedula_con;`
        const reg = await query(sql);
        res.status(200).send(reg);
    }catch(error){
        res.status(401).send({message:error});
        console.log("error -> ", error)
    }    
}

const lista_conductores_disponibles = async function(req, res) {
    try{
        let sql = `select usuarios.cedula, usuarios.nombres, usuarios.apellidos, usuarios.email, usuarios.rol, 
                    conductores.foto_con 
                    from usuarios
                    inner join conductores where usuarios.cedula = conductores.cedula_con
                    and not exists (select null from rutas where usuarios.cedula = rutas.cedula)`
        const reg = await query(sql);
        res.status(200).send(reg);
    }catch(error){
        res.status(401).send({message:error});
        console.log("error -> ", error)
    }    
}


const editar_conductor = async function(req, res) {
    try{
        var data = req.body;
        let sql = `Select * from usuarios where cedula = ${connection.escape(data.cedula)}`;
        const reg = await query(sql);  
        let sql2;      
        if(reg != ""){
            if(reg[0].email == data.email){
                sql2 = `Update usuarios set nombres = ${connection.escape(data.nombres)}, apellidos = ${connection.escape(data.apellidos)} where cedula = ${connection.escape(data.cedula)};`
                const reg2 = await query(sql2);
                let sql3 = `Select * from conductores where cedula_con = ${connection.escape(data.cedula)}`;
                const reg3 = await query(sql3);
                if(data.path != null){
                    var name = data.path.split('/');
                    var foto_name = name[6];
                    data.path = foto_name;
                    fs.writeFileSync('src/uploads/conductores/'+data.path, new Buffer.from(data.imagen64, "base64"), function(err) {});
                    sql1 = `Update conductores set foto_con = ${connection.escape(data.path)} where cedula_con = ${connection.escape(data.cedula)};`;
                    const reg1 = await query(sql1);
                    eliminar_foto_backend(reg3[0].foto_con);
                }
                res.status(200).send({data:reg[0],message:"Exito"});
            }else{
                let sql5 = `Select * from usuarios where email = ${connection.escape(data.email)}`;
                const reg5 = await query(sql5);
                if(reg5 == ""){
                    sql2 = `Update usuarios set nombres = ${connection.escape(data.nombres)}, apellidos = ${connection.escape(data.apellidos)}, email = ${connection.escape(data.email)} where cedula = ${connection.escape(data.cedula)};`
                    const reg2 = await query(sql2);
                    let sql3 = `Select * from conductores where cedula_con = ${connection.escape(data.cedula)}`;
                    const reg3 = await query(sql3);
                    if(data.path != null){
                        var name = data.path.split('/');
                        var foto_name = name[6];
                        data.path = foto_name;
                        fs.writeFileSync('src/uploads/conductores/'+data.path, new Buffer.from(data.imagen64, "base64"), function(err) {});
                        sql1 = `Update conductores set foto_con = ${connection.escape(data.path)} where cedula_con = ${connection.escape(data.cedula)};`;
                        const reg1 = await query(sql1);
                        eliminar_foto_backend(reg3[0].foto_con);
                    }
                    res.status(200).send({data:reg[0],message:"Exito"});
                }else{
                    res.status(401).send({data:reg[0],message:"El correo electrónico ya está registrado"})
                }
            }
        }
    }catch(error){
        console.log("error -> ", error)
        res.status(401).send({message:error});
        
    }
}

const eliminar_conductor = async function(req, res) {
    try{
        var cedula = req.params['cedula'];
        let sql1 = `Select * from conductores where cedula_con= ${connection.escape(cedula)};`;
        const reg1 = await query(sql1);
        if(reg1!=""){
            let sql2 = `Delete from usuarios where cedula = ${connection.escape(cedula)};`;
            const reg2 = await query(sql2);
            eliminar_foto_backend(reg1[0].foto_con);
            res.status(200).send({data:reg2[0],message:"El registro ha sido eliminado"});
        }else{
            res.status(401).send({data:reg1[0],message:"Error"});
        }
    }catch(error){
        console.log("error -> ", error)
    }
}


const obtener_foto_conductor = async function(req, res){
    var img = req.params['img'];
    fs.stat('./src/uploads/conductores/'+img, function(err){
        if(!err){
            let path_img = './src/uploads/conductores/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './src/uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

function eliminar_foto_backend(foto){
    if(fs.existsSync('src/uploads/conductores/'+foto)){
        fs.unlinkSync('src/uploads/conductores/'+foto)
    } 
}

module.exports = {
    registro_conductor,
    lista_conductores,
    lista_conductores_disponibles,
    editar_conductor,
    obtener_foto_conductor,
    eliminar_conductor
}