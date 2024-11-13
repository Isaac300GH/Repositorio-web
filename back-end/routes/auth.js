const express = require('express');
const { 
    registrarUsuario,
    loginUsuario,
    obtenerUsuarios,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/authController');
const protegerRuta = require('../middleware/authMiddleware')
const verificarRol = require('../middleware/verificarPermisos');
const router = express.Router();
// Ruta para registrar un nuevo usuario
router.post('/registro', protegerRuta, verificarRol(["admin"]), registrarUsuario);
// Ruta para el login de usuario
router.post('/login', loginUsuario); 
// Ruta para actualizar a un usuario por id
router.put('/:id', protegerRuta, verificarRol(["admin", "profesor"]), actualizarUsuario);
// Ruta para obtener a todos los usuarios
router.get('/', protegerRuta, verificarRol(["admin", "profesor"]), obtenerUsuarios);
// Ruta para eliminar a un usuario por id
router.delete('/:id', protegerRuta, verificarRol(["admin", "profesor"]), eliminarUsuario);

module.exports = router;
