const express = require('express');
//libreria para poder encriptar la contraseña
const bcryt = require('bcrypt');
//es una libreria la cual ofrece demasiadas funcionalidades incrementando la potencia de javascript
const _ = require('underscore');
//llamos al modelo donde se va a realizar toda la interaccion con la base de datos
const Administrator = require('../models/administrator');
const app = express();


app.get('/admin', function (req, res) {

    //mandamos los valores mediante la ruta
    //el desde y el limite, para realizar una paginación
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //el find funciona como un where
    //skip es donde colocamos desde que valor queremos
    //limit es donde colocamos el limite
    //exec ejecuta la funcion de tipo callback/flecha
    Administrator.find({estado:true}, 'nombre email role estado google img')
                    .skip(desde)
                    .limit(limite)
                    .exec((err, admins)=>{

                        if(err){
                            return res.status(400).json({
                                ok: false,
                                err
                            });
                        }

                        //de esta manera sabemos con cuantos registros cuenta la base de datos
                        Administrator.countDocuments({estado:true},(err,conteo)=>{
                            res.json({
                                ok:true,
                                admins,
                                cuantos: conteo
                            });
                        });

                       
                    });
});

app.post('/admin', function (req, res) {

    //con el req.body se obtienen los valores que son enviados
    let body = req.body;

    //le indicamos al modelo los campos con los cuales vamos a interactuar
    //el modelo esta declarado en la parte de arriba (video 97)
    // colocamos bcryt.hashSync(body.password,10) para poder encriptar la contraseña (video 96)
    let admin = new Administrator({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: bcryt.hashSync(body.password,10),
        role: body.role
    });

    //guardamos la informacion en la base de datos
    admin.save((err,adminDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //adminDB.password = null;

        res.json({
            ok:true,
            admin:adminDB
        });

    });


    // if(body.nombre ===undefined)
    // {
    //     //con res, mandamos una respuesta
    //     //y con el status indicamos el numero para saber que es lo que paso
    //     //en esta ocasion es un error 400
    //     //retornando el json
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });
    // }
    // else
    // {
    //     res.json({
    //         persona: body
    //     });
    // }

    
});

app.put('/admin/:id', function (req, res) {

    let id = req.params.id;
    //pick es una funcion de underscore donde le indicamos que valores queremos que tome del arreglo
    let body = _.pick(req.body, ['nombre','apellido','email','img','role','estado']);
    

    //metodo de mongoose para buscar a un usuario y modificarlo mediante el id que nos manda mongoo
    //runValidators: true para que tome las validaciones que declaramos en el modelo
    //el new true retorna el valor modificado
    Administrator.findOneAndUpdate({ _id: id }, body, {new:true, runValidators: true}, (err,adminDB)=>{
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            admin: adminDB
        });
    });
});

app.delete('/admin/:id', function (req, res) {
    
    let id = req.params.id;
    // Administrator.findByIdAndRemove(id,(err,adminDelete)=>{
    let cambiaEstado = {
        estado: false
    }

    Administrator.findOneAndUpdate({ _id: id },cambiaEstado,{new:true},(err,adminDelete)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err 
            });
        }

        if(!adminDelete){
            return res.status(400).json({
                ok: false,
                err:{
                    message:'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            admin:adminDelete
        })
    });

});

module.exports=app; 