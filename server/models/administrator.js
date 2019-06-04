const mongoose = require('mongoose');
//libreria para hacer validaciones de campos
const uniqueValidator = require('mongoose-unique-validator');
//en este objetos indicamos los roles que estan permitidos en la parte de value
//y el mensaje de error
//lo colocamos en la variable enum dentro del objeto role
let rolesValidos ={
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

//declaramos la variable para poder interactuar con la base de datos y el modelo
let Schema = mongoose.Schema;

//colocamos la estructura del modelo, que son los campos con los que cuenta la base de datos
let administratorSchema = new Schema({
    nombre: {
        type: String,
        required: [true,'El nombre es necesario']
    },
    apellido: {
        type: String,
        required: [true,'El apellido es necesario']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique:true,
    },
    password: {
        type: String,
        required: [true,'la contraseña es obligatoria']
    },
    img:{
        type:String,
        required: false
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
       type:Boolean,
       default: true
    },
    google:{
        type:Boolean,
        default:false
    }

});

//eliminamos el password de la informacion que se va a retornar, para que el usuario final no la pueda ver
administratorSchema.methods.toJSON = function(){
   let admin = this;
   let adminObject = admin.toObject();
   delete adminObject.password;
   return adminObject;

}

//indicamos que el valor del campo no se puede repetir, en este caso solo lo pusimos en email
//con el valor unique
administratorSchema.plugin(uniqueValidator,{
    message:'{PATH} debe de ser unico'
});

//exportamos el modelo, el primer campo es el nombre con el cual va a ser usado cuando se exporte
module.exports = mongoose.model('Administrator', administratorSchema);



/*
ROLE = NIVEL
id_usuario
id_ciudad
fecha_alta
fecha_modif
user_modif
*/