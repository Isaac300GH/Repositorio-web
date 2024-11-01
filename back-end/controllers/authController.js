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

        const token = jwt.sign({ id: nuevoUsuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Usa la clave secreta de JWT
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

        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Usa la clave secreta de JWT
        res.json({ token });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

module.exports = { registrarUsuario, loginUsuario };
