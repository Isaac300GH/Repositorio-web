const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String, 
        unique: true,
        required: true
    }, // El nombre del usuario, debe ser único
    password: {
        type: String,
        required: true
    }, // La contraseña del usuario, almacenada de forma segura
    rol: {
        type: String, 
        enum: [
            'admin', 
            'profesor'
        ], 
        default: 'profesor' } // El rol del usuario, solo puede ser 'admin' o 'profesor', por defecto es 'profesor'
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
