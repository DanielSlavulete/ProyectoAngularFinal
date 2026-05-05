const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Validación básica de entrada antes de llamar al service.
    // Evita registrar usuarios con datos incompletos.
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Nombre, email y contraseña son obligatorios',
      });
    }

    // Validación mínima de contraseña en backend.
    // Aunque Angular también valida, el backend nunca debe confiar solo en el frontend.
    if (password.length < 6) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    // Registra el usuario, hashea la contraseña y genera el token JWT.
    const result = await authService.registerUser({ name, email, password });

    return res.status(201).json(result);
  } catch (error) {
    // Enviamos cualquier error al middleware central de errores.
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validación básica para comprobar que llegan las credenciales.
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son obligatorios',
      });
    }

    // Comprueba credenciales en el service.
    // Si son correctas, devuelve usuario saneado + token JWT.
    const result = await authService.loginUser({ email, password });

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    // Ruta protegida que devuelve el usuario autenticado.
    // req.user viene del authMiddleware después de validar el token JWT.
    const user = await authService.getUserById(req.user.id);

    return res.json({
      user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  me,
};