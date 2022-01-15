/*
    ruta: '/api/medicos'
*/

const{ Router }= require('express');
const{check} = require('express-validator');
const{validarCampos} = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');
const {getMedicos, crearMedico, actualizarMedico, borrarMedico} = require ('../controllers/medicos-controllers');

const router = Router();

router.get( '/', getMedicos);

router.post( '/',
    [
        validarJWT,
        check('nombre', 'El nombre del Médico es obligatorio').not().isEmpty(),
        check('hospital', 'El hospital Id debe ser válido').isMongoId(),
        validarCampos

    ],
    crearMedico
);   

router.put( '/:id',
    [
     
    ],
    actualizarMedico
);

router.delete( '/:id',
    
    borrarMedico

);

module.exports = router;