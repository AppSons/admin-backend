const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN);
        
        console.log('DB Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error para iniciar BD, ver logs');
        
    }
}
module.exports = {
    dbConnection
}