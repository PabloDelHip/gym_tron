require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
//boyd parser es para manejar los valores que nos envien mediante post
//es una libreria
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
//tiene que ser declarado a fuerza
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
//tiene que ser declarado a fuerza
app.use(bodyParser.json());

app.use(require('./routes/administrators'));


//comando de conexion para una base de datos en mongo
//utilizando una funcion de tipo flecha
//es una libreria que se tiene que descargar mediante npm
//video 92
mongoose.connect(process.env.URLDB, {useNewUrlParser: true})
.then(()=>console.log("Base de datos ONLINE"))
.catch((err)=>console.log(err));

//process.env.PORT es una variable de entorno
//que se encuentra en el archivo config
//donde indicamos el puerto donde va a trabajar la aplicación
app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto");
})