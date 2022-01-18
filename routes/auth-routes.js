const{ Router }= require('express');
const { check } = require('express-validator');
const {login, googleSingIn} = require('../controllers/auth-controller');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post('/',
    [
        check('email', 'El Email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    login
);

router.post('/google',
    [
      
        check('token', 'El token es obligatorio').not().isEmpty(),
        validarCampos
    ],
    googleSingIn
)





module.exports = router;