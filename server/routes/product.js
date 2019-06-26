const express = require('express');

let {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//////////////////////////////////
//MOSTRAR TODAS LAS CATEGORIAS
//////////////////////////////////
app.get('/productos',verificaToken,(req,res)=>{
    
    res.json({
        ok:true,
    })
});

module.exports = app;