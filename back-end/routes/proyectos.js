const express = require('express');
const {
    crearProyecto,
    obtenerProyectos,
    obtenerProyectosBusqueda,
    obtenerProyecto,
    actualizarProyecto,
    eliminarProyecto
} = require('../controllers/proyectosController');
const protegerRuta = require('../middleware/authMiddleware');
const verificarRol = require('../middleware/verificarPermisos');
const uploads = require('../config/multer');
const router = express.Router();

// Ruta para crear un proyecto (solo admin)
router.post('/', protegerRuta, verificarRol(["admin"]), uploads.single('file'), crearProyecto);

// En tu archivo de rutas del servidor
router.get('/', obtenerProyectosBusqueda);

// Ruta para obtener todos los proyectos (todos)
router.get('/', obtenerProyectos);

// Ruta para obtener un proyecto por ID (todos)
router.get('/:id', obtenerProyecto);

// Ruta para actualizar un proyecto por ID (profesores y admin)
router.put('/:id', protegerRuta, verificarRol(["admin", "profesor"]), actualizarProyecto);

// Ruta para eliminar un proyecto por ID (solo admin)
router.delete('/:id', protegerRuta, verificarRol(["admin"]), eliminarProyecto);

module.exports = router;
