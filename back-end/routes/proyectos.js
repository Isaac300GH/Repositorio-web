const express = require('express');
const {
    crearProyecto,
    obtenerProyectos,
    obtenerProyecto,
    actualizarProyecto,
    eliminarProyecto
} = require('../controllers/proyectosController');
const protegerRuta = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para crear un proyecto (solo admin)
router.post('/', protegerRuta, crearProyecto);

// Ruta para obtener todos los proyectos (todos)
router.get('/', obtenerProyectos);

// Ruta para obtener un proyecto por ID (todos)
router.get('/:id', obtenerProyecto);

// Ruta para actualizar un proyecto por ID (profesores y admin)
router.put('/:id', protegerRuta, actualizarProyecto);

// Ruta para eliminar un proyecto por ID (solo admin)
router.delete('/:id', protegerRuta, eliminarProyecto);

module.exports = router;
