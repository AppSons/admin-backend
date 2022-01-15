const fs = require('fs');

const Usuario  = require('../models/usuario');
const Medico   = require('../models/medicos');
const Hospital = require('../models/hospital');

const borrarImagenAnterior = ( path ) => {
    if (fs.existsSync(path)) {
        //Borra imagen anterior
        fs.unlinkSync(path);
    }
}


const updateImagen = async (tipo, id, nombreArchivo) =>{

    let pathAnterior = '';

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('No se encontró médico x id');
                return false;                
            }
            pathAnterior = `./uploads/medicos/${medico.img}`;
            borrarImagenAnterior(pathAnterior);
            
            medico.img = nombreArchivo;
            await medico.save();
            return true;

        break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('No se encontró hospital x id');
                return false;                
            }
            pathAnterior = `./uploads/hospitales/${hospital.img}`;
            borrarImagenAnterior(pathAnterior);
            
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No se encontró usuario x id');
                return false;                
            }
            pathAnterior = `./uploads/usuarios/${usuario.img}`;
            borrarImagenAnterior(pathAnterior);
            
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        break;
        default:
            break;
    }

}



module.exports = {
    updateImagen
}