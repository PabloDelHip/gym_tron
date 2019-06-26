const express = require('express');

let {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//////////////////////////////////
//MOSTRAR TODAS LAS CATEGORIAS
//////////////////////////////////
app.get('/categoria',verificaToken,(req,res)=>{
    
    Categoria.find({})
        .sort('descripcion')
        .populate('admin','nombre email')
        .exec((err,categorias)=>{

            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                categorias
            })
        
        });
});

//////////////////////////////////
//MOSTRAR UNA CATEGORIA POR ID
//////////////////////////////////
app.get('/categoria/:id',verificaToken,(req,res)=>{

    let id = req.params.id;
    
    Categoria.findById({_id:id},(err,categoriaDB) => {
        if(err){
            return res.status(500).json({
                status:500,
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                status:400,
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        })
    });

});

//////////////////////////////////
//MOSTRAR TODAS LAS CATEGORIAS
//////////////////////////////////
app.post('/categoria',verificaToken,(req,res)=>{
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        admin: req.admin._id,
    });

    categoria.save((err,categoriaDB)=>{

        if(err){
            return res.status(500).json({
                status:500,
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                status:400,
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        })

    });
});

//////////////////////////////////
//MOSTRAR TODAS LAS CATEGORIAS
//////////////////////////////////
app.put('/categoria/:id',verificaToken,(req,res)=>{
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion:body.descripcion
    }

    Categoria.findOneAndUpdate({ _id: id },descCategoria,{new:true, runValidators: true},(err,categoriaDB)=>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        })

    })
});

//////////////////////////////////
//MOSTRAR TODAS LAS CATEGORIAS
//////////////////////////////////
app.delete('/categoria/:id',[verificaToken,verificaAdminRole],(req,res)=>{
    
    let id= req.params.id;

    Categoria.findOneAndRemove({ _id: id },(err,categoriaDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok:true,
            message: 'Categoria Borrada'
        })

    });

});

module.exports = app;