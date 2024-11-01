const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config(); // Carga las variables del archivo .env

const authRoutes = require('./routes/auth');
const proyectoRoutes = require('./routes/proyectos');
const protegerRuta = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());

// Conexión a MongoDB
connectDB();

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas de proyectos (todos pueden consultar proyectos sin autenticarse)
app.use('/proyectos', proyectoRoutes);

// Middleware para proteger las rutas de CRUD
app.use('/proyectos/:id', protegerRuta, (req, res, next) => {
    const metodo = req.method;
    const usuario = req.usuario; // Obtenemos la información del usuario desde el token JWT

    if ((metodo === 'POST' || metodo === 'DELETE') && usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'Permiso denegado' });
    }

    if (metodo === 'PUT' && usuario.rol !== 'admin' && usuario.rol !== 'profesor') {
        return res.status(403).json({ mensaje: 'Permiso denegado' });
    }

    if (usuario.rol === 'profesor' && metodo === 'PUT') {
        Proyecto.findById(req.params.id, (err, proyecto) => {
            if (err || !proyecto) {
                return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
            }
            if (proyecto.propietario.toString() !== usuario.id) {
                return res.status(403).json({ mensaje: 'Permiso denegado' });
            }
            next();
        });
    } else {
        next();
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
