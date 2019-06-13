const express = require('express');
//libreria para poder encriptar la contraseña
const bcryt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
        //si la contraseña encryptada es incorrecta esntra aqui
        //compara la password que mandamos con la de la base de datos
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

//Configuraciones de google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    //el payload es donde se obtiene toda la informacion de la persona que hace login
    const payload = ticket.getPayload();
    // const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

  }
//   verify().catch(console.error);

app.post('/google',async(req,res)=>{
    let token = req.body.idtoken;

    let googleUser = await verify(token)
                    .catch(e=>{
                        return res.status(403).json({
                            ok:false,
                            err:e
                        });
                    });

    Administrator.findOne({email:googleUser.email},(err,adminDB)=>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }; 

        if(adminDB)
        {
            if(adminDB.google ===false){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'Debe de usar su autenticacion normal'
                    }
                });
            }
            else
            {
                let token = jwt.sign({
                    admin:adminDB
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: adminDB,
                    token,
                });
            }
        }
        else
        {
            //si el usuario no existe en nuestra base de datos
            let admin = new Administrator();
            admin.nombre = googleUser.nombre;
            admin.apellido = googleUser.nombre;
            admin.email = googleUser.email;
            admin.img = googleUser.img;
            admin.google = true;
            admin.password= ':)';

            admin.save((err,adminDB)=> {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    admin:adminDB
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok:true,
                    admin:adminDB,
                    token
                });

            });
        }
    });
    // res.json({
    //     admin: googleUser,
    // });
});

module.exports=app; 


