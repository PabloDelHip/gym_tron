const express = require('express');
//libreria para poder encriptar la contraseña
const bcryt = require('bcrypt');
const jwt = require('jsonwebtoken');

//llamos al modelo donde se va a realizar toda la interaccion con la base de datos
const Administrator = require('../models/administrator');
const app = express();

app.post('/login',(req,res)=>{
    let body = req.body; 

    //findOne para buscar en el modelo un email que sea igual al que mandamos por request
    Administrator.findOne({email:body.email}, (err,adminDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
    
        if(!adminDB)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
    
        if(!bcryt.compareSync(body.password, adminDB.password))
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            admin:adminDB
        },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});
    
        res.json({
            ok:true,
            admin: adminDB,
            token
        }) 
    });
});

module.exports=app; 