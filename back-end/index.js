const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // Carga las variables del archivo .env

const authRoutes = require('./routes/auth');
const proyectoRoutes = require('./routes/proyectos');
const cors = require('cors');

const app = express();
// Configura CORS para permitir acceso desde el frontend
app.use(cors({origin: '*' }));
// Cambia esto al origen de tu frontend
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
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
