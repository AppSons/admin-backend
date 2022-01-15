const {response} = require('express');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medicos');

const getDocColeccion = async (req, res = response ) => {

    const tabla    = req.params.tabla;
    const busqueda = req.params.busquedas;
    const regexp   = RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({nombre: regexp})
                               .populate('usuario', 'nombre img')
                               .populate('hospital', 'nombre img');
        break;
    
        case 'hospitales':
            data = await Hospital.find({nombre: regexp})
                                 .populate('usuario', 'nombre img');
        break;

        case 'usuarios':
            data = await Usuario.find({nombre: regexp});
        break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser medicos/usuarios/hospitales'
            });       
        
    }
        
    res.json({
        ok: true,
        resultados: data
    })
}

const getBusqueda = async (req, res = response ) => {

    const busqueda = req.params.busquedas;
    const regexp   = RegExp(busqueda, 'i');
        
    const [usuarios, hospitales, medicos] = await Promise.all([
        Usuario.find({ nombre: regexp }),
        Hospital.find({ nombre: regexp }),
        Medico.find({ nombre: regexp }),
    ])

       
    res.json({
        ok: true,        
        usuarios,
        hospitales,
        medicos
    })
}


module.exports = {
    getBusqueda,
    getDocColeccion
}