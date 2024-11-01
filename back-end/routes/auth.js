const express = require('express');
const { registrarUsuario, loginUsuario } = require('../controllers/authController');
const router = express.Router();

router.post('/registro', registrarUsuario); // Ruta para registrar un nuevo usuario
router.post('/login', loginUsuario); // Ruta para el login de usuario

module.exports = router;
