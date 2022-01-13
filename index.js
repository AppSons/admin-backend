
const express = require('express');
require('dotenv').config();
const cors = require('cors');


const {dbConnection} = require('./database/config');

//Crear el Servidor de express

const app = express();

//configurar CORS

app.use(cors());

//Lectura y Parseo del body

app.use(express.json());

//Conexión a BBDD

dbConnection();


//Rutas

app.use('/api/usuarios', require('./routes/usuarios-routes'));
app.use('/api/login', require('./routes/auth-routes'));



app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto' +  process.env.PORT);
});

