const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Nombre, email y contraseña son obligatorios',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    const result = await authService.registerUser({ name, email, password });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son obligatorios',
      });
    }

    const result = await authService.loginUser({ email, password });

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
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
