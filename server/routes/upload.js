const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Admin = require('../models/administrator');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res){

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files)
    {
        return res.status(400)
        .json({
            ok:false,
            err:{
                message: 'no se ha seleccionado ningun archivo'
            }
        });
    }

    //Validar tipos
    let tipoValidos = ['productos','usuarios'];
    if(tipoValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err: {
                message: 'Los tipos permitidos son ' + tipoValidos.join(', '),
            }
        })
    }

    //let archivo es donde se toma el archivo que se esta mandando
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    //extenciones permitidas
    let extencionesValidas =  ['png','jpg','gif','jpeg'];

    if(extencionesValidas.indexOf(extension)<0)
    {
        return res.status(400).json({
            ok:false,
            err: {
                message: 'Las extensiones permitidas son ' + extencionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre al archivo
    //cambiamos el nombre del archivo antes de gaurdardlo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //aqui guardamos el archivo
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`,(err)=>{
        if(err)
        return res.status(500)
            .json({
                ok:false,
                err
            });

        //Imgen cargada

        // res.json({
        //     ok:true,
        //     message:'Imagen subida de forma correcta'
        // })
        if(tipo==='usuarios')
        {
            imagenUsuario(id,res,nombreArchivo);
        }
        else
        {
            imagenProducto(id,res,nombreArchivo);
        }
        
    });

});

function imagenUsuario(id, res,nombreArchivo)
{
    Admin.findById({_id:id},(err,usuarioDB)=>{
        if(err)
        {
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!usuarioDB)
        {
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario no existe'
                }
            })
        }

        borraArchivo(usuarioDB.img,'usuarios')

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err,usuarioGuardado)=>{
            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res,nombreArchivo)
{
    Producto.findById({_id:id},(err,productoDB)=>{
        if(err)
        {
            borraArchivo(nombreArchivo,'productos');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB)
        {
            borraArchivo(nombreArchivo,'productos');
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'producto no existe'
                }
            })
        }

        borraArchivo(productoDB.img,'productos')

        productoDB.img = nombreArchivo;
        productoDB.save((err,productoGuardado)=>{
            res.json({
                ok:true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

//Con esto borramos una imagen verificamos si existe esa imagen si existe la borramos
function borraArchivo(nombreImagen,tipo)
{
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`);

        if(fs.existsSync(pathImagen))
        {
            fs.unlinkSync(pathImagen);
        }
}

module.exports = app;