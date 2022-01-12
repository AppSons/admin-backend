
const express = require('express');
require('dotenv').config();
const cors = require('cors');


const {dbConnection} = require('./database/config');

//Crear el Servidor de express

const app = express();

//configurar CORS

app.use(cors());

//Conexión a BBDD

dbConnection();


//Rutas
app.get( '/', (req, res)=>{

    res.json({
        ok: true,
        msg: 'Hola que Tal?'
    });
});


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto' +  process.env.PORT);
});

