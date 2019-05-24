require('./config/config');
const express = require('express');
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

app.get('/usuario', function (req, res) {
    res.json('usuario')
});

app.post('/usuario', function (req, res) {

    //con el req.body se obtienen los valores que son enviados
    let body = req.body;

    if(body.nombre ===undefined)
    {
        //con res, mandamos una respuesta
        //y con el status indicamos el numero para saber que es lo que paso
        //en esta ocasion es un error 400
        //retornando el json
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    }
    else
    {
        res.json({
            persona: body
        });
    }

    
});

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
});

app.get('/', function (req, res) {
  res.json('Hello World')
});
 
app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto");
})