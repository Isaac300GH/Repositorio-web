const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ mensaje: 'Permiso denegado. No tienes acceso a esta ruta.' });
        }
        next();
    };
};

module.exports = verificarRol;
