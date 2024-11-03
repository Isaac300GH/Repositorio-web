const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registrarUsuario = async (req, res) => {
    const { nombre, password, rol } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevoUsuario = new Usuario({ nombre, password: hashedPassword, rol });
        await nuevoUsuario.save();

        const token = jwt.sign({ id: nuevoUsuario._id, rol: nuevoUsuario.rol }, process.env.JWT_SECRET, { expiresIn: '10h' }); // Incluye el rol en el token
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

const loginUsuario = async (req, res) => {
    const { nombre, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ nombre });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }

        const esPasswordValido = await bcrypt.compare(password, usuario.password);
        if (!esPasswordValido) {
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '10h' }); // Incluye el rol en el token
        res.json({ token });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Actualizar un usuario por id
const actualizarUsuario = async (req, res) => {
    try {
        const { password, ...otrosCampos } = req.body;

        // Si el campo `password` existe, encriptar la nueva contraseña
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            otrosCampos.password = hashedPassword; // Añadir la contraseña encriptada a los campos de actualización
        }

        // Actualizar el usuario con los campos modificados
        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, otrosCampos, { new: true });
        if (!usuarioActualizado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        res.json(usuarioActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

// Eliminar un usuario por id
const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = {
    registrarUsuario, 
    loginUsuario,
    obtenerUsuarios,
    actualizarUsuario,
    eliminarUsuario
};
