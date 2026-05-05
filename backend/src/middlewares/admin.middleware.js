function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      message: 'Acceso denegado. Se requiere rol de administrador',
    });
  }

  next();
}

module.exports = adminMiddleware;
