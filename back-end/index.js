const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // Carga las variables del archivo .env

const authRoutes = require('./routes/auth');
const proyectoRoutes = require('./routes/proyectos');
const protegerRuta = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());

// Conexión a MongoDB
connectDB();

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas de proyectos (todos pueden consultar proyectos sin autenticarse)
app.use('/proyectos', proyectoRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
