const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    resumen: {
        type: String,
        required:true
    },
    palabrasClave: [{
        type: String,
        required: true
    }],
    autores: [{
        type: String,
        required: true
    }],
    gestion: {
        type: Number,
        required: true
    },
    tutores: [{
        type: String,
        required: true
    }],
    calificacion: { 
        type: Number,
        default: null },
    categorias: [{
        type: String,
        required: true
    }],
    pdfUrl: String // Añade un campo para la URL del PDF
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

module.exports = Proyecto;
