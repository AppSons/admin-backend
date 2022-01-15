const path = require('path');
const fs = require('fs');

const {response} = require('express');
const { v4: uuidv4 } = require('uuid');
const { updateImagen } = require('../helpers/update-imagen');

const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id   = req.params.id;

    //Validar tipo
    const tiposValidos = ['hospitales','medicos','usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un tipo médico, usuario u hospital!!'
        });
        
    }
    //Validamos que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo seleccionado'
        });
    }
    //Procesamos la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');//batman.1.2.png
    const extArchivo = nombreCortado[nombreCortado.length - 1].toLowerCase();

    //Valido la extension
    const extValidas = ['png', 'jpg','jpeg', 'gif'];
    if (!extValidas.includes(extArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Archivo no permitido!!'
        });
    } 
    //Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extArchivo}`;

    //Path donde se guarda la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //Mover la imagen
    file.mv(path, (error) => {
        if (error) {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });            
        }
        //Actualizar imagen en Base de Datos

        updateImagen(tipo, id, nombreArchivo);


        res.json({
            ok: true,
            msg: 'Archivo subido con exito!!',
            nombreArchivo
        });
    });


    

}

const retornaImagen = ( req, res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }`);

    //imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join( __dirname, `../uploads/no-img.png`);
        res.sendFile(pathImg);
    }

    
}

module.exports = {
    fileUpload,
    retornaImagen
}