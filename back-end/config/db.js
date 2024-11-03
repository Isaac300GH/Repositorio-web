const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');
    } catch (err) {
        console.error('No se pudo conectar a MongoDB', err);
        process.exit(1);
    }
};

module.exports = connectDB;
