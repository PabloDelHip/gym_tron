const jwt = require('jsonwebtoken');

//=================
// Verificar Token
//=================
let verificaToken = (req,res,next) => {

    let token = req.get('token');
    // console.log(token);

    jwt.verify(token, process.env.SEED,(err,decoded)=>{
        if(err)
        {
            return res.status(401).json({
                ok:false,
                err: {
                    message :'token no valido'
                }
            });
        }
        //el req admin es igual al token decodificado, el .admin sale del login en la parte final de la funcion
        //donde le indicamos el nombre del json
        //de esta manera mandamos los datos a la funcion donde se use
        //este middleware
        //el next es para salir de esta funcion despues de la validacion
        //si no se coloca, la aplicacion no continua
        req.admin = decoded.admin;
       
        next();
    });

};

//=================
// Verificar Admin Role
//=================

let verificaAdminRole = (req,res,next) => {
    let admin = req.admin;

    if(admin.role==='ADMIN_ROLE'){
        next();
    }
    else
    {
       return res.json({
            ok:false,
            err:{
                message:'El usuario no es administrador'
            }
        });
    }

    
};

//=================
// Verificar Token para imagen
//=================
let verificaTokenImg = (req,res,next) => {

    //el token es req.query.token es igual a cuando se recibe una varibale de tipo get mediante php
    //por la url
    let token = req.query.token;

    jwt.verify(token, process.env.SEED,(err,decoded)=>{
        if(err)
        {
            return res.status(401).json({
                ok:false,
                err: {
                    message :'token no valido'
                }
            });
        }
        req.admin = decoded.admin;
       
        next();
    });

}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg,
}