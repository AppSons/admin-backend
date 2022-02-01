const bcrypt = require('bcryptjs');
const {response} = require('express');
const { googleVerify } = require('../helpers/google-verifi');
const { generarJWT } = require('../helpers/jwt');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');
const Usuario = require('../models/usuario');


const login = async(req, res = response) => {

    const {email, password} = req.body;

    try {

        //Verificar email
        const usuarioDB = await Usuario.findOne({email});
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
            
        }
        //Verificar password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password No Válido'
            });
            
        }
        //Generar Token-JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuarioDB.role)
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con Admin'
        })
    }
}

const googleSingIn = async(req, res=response) =>{

    const googleToken = req.body.token;

    
    try {
        const {name, email, picture} = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        
        let usuario;
        if (!usuarioDB) {
            //Si NO existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        }else {
            // existe ususario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en DB
        await usuario.save();

        //Generar Token-JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok:true,
            token,
            menu: getMenuFrontEnd(usuario.role)
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg:'Token Incorrecto',
            
        }); 
    }

    
}

const renewToken = async (req, res = response) => {
    const uid = req.uid;
    //Generar el TOKEN -JWT
    const token = await generarJWT(uid);

    //Obtener usuario por uid
    const usuario = await Usuario.findById(uid);                               

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontEnd(usuario.role)
    });
}

module.exports = {
    login,
    googleSingIn,
    renewToken
}