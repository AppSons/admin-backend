const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const res = require('express/lib/response');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res )=>{

    const desde = Number(req.query.desde) || 0;
    
    const [usuarios, total] = await Promise.all([
            Usuario
                    .find({},'nombre email role google img')
                    .skip(desde)
                    .limit(5),
            Usuario.countDocuments()
    ]);
    
    res.json({
        ok: true,        
        usuarios,
        total
        
    });
}

const crearUsuarios = async(req, res = response)=>{

    
    const {email, password} = req.body;

   

    try {

        const existeEmail = await Usuario.findOne({email});

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El Email ya está registrado en la Base de Datos'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar Password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardo usuario
        await usuario.save();

        //Generar Token-JWT
        const token = await generarJWT(usuario.id);
    
    
        res.json({
            ok: true,            
            usuario,
            token
        }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado... revisar logs'
        });
        
    }

    
}

const actualizarUsuario = async (req, res = response) => {

    //TODO: Validar token y comprobar si es el usuario correcto
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese id'
            });
            
        }
        
        //Actualizaciones del usuario
        const {password, google, email, ...campos} = req.body;

        if (usuarioDB.email !== email) {
           const existeEmail = await Usuario.findOne({email});
           if (existeEmail) {
               return res.status(400).json({
                   ok: false,
                   msg: 'Ya existe un usuario con ese Email'
               });
               
           } 
        }
        if (!usuarioDB.google) {
            campos.email = email;    
        }else if (usuarioDB.email !== email){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de Google no puede cambiarse el correo'
            });
        }
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new: true});



        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({

            ok: false,
            msg: 'Error inesperado'
        });
        
    }
}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese id'
            });
            
        }
        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Admin' 
        });
    }
}
module.exports = { 
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario,
}