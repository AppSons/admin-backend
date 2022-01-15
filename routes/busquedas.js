/*  Busquedas
  ruta '/api/todo'
*/
const{ Router }= require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getBusqueda, getDocColeccion} = require ('../controllers/busquedas');

const router = Router();

router.get( '/:busquedas', validarJWT, getBusqueda );

router.get( '/coleccion/:tabla/:busquedas', validarJWT, getDocColeccion );


module.exports = router;