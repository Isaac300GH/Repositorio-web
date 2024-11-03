const jwt = require('jsonwebtoken');

const protegerRuta = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ mensaje: 'No hay token, permiso no válido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Decodifica el token y añade el usuario con su rol al objeto `req`
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token no válido' });
    }
};

module.exports = protegerRuta;
