
const express = require('express');
require('dotenv').config();
const path = require('path');

const cors = require('cors');


const {dbConnection} = require('./database/config');
const req = require('express/lib/request');
const res = require('express/lib/response');

//Crear el Servidor de express

const app = express();

//configurar CORS

app.use(cors());

//Lectura y Parseo del body

app.use(express.json());

//Conexión a BBDD

dbConnection();

//Directorio público

app.use(express.static('public'));


//Rutas

app.use('/api/usuarios', require('./routes/usuarios-routes'));
app.use('/api/hospitales', require('./routes/hospitales-routes'));
app.use('/api/medicos', require('./routes/medicos-routes'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads-r'));
app.use('/api/login', require('./routes/auth-routes'));

//lo último, si no es cualquiera de las rutas anteriores

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});



app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto' +  process.env.PORT);
});

