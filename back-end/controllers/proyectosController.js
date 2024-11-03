const Proyecto = require('../models/Proyecto');

// Crear un nuevo proyecto
const crearProyecto = async (req, res) => {
    try {
        const proyectoData = req.body;

        // Procesar archivo PDF
        if (req.file) {
            proyectoData.pdfUrl = `${process.env.SERVER_URL}/uploads/${req.file.filename}`; // Guarda la URL del archivo PDF
        }

        const nuevoProyecto = new Proyecto(proyectoData);
        const proyectoGuardado = await nuevoProyecto.save();

        res.status(201).json(proyectoGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

// Obtener todos los proyectos
const obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find();
        res.json(proyectos);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Obtener un proyecto por id
const obtenerProyecto = async (req, res) => {
    try {
        const proyecto = await Proyecto.findById(req.params.id);
        if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        res.json(proyecto);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Actualizar un proyecto por id
const actualizarProyecto = async (req, res) => {
    try {
        const proyecto = await Proyecto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        res.json(proyecto);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

// Eliminar un proyecto por id
const eliminarProyecto = async (req, res) => {
    try {
        const proyecto = await Proyecto.findByIdAndDelete(req.params.id);
        if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        res.json({ mensaje: 'Proyecto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = {
    crearProyecto,
    obtenerProyectos,
    obtenerProyecto,
    actualizarProyecto,
    eliminarProyecto
};
