const userService = require('../services/user.service');

async function getMe(req, res, next) {
  try {
    // Devuelve los datos del usuario logueado.
    // req.user viene del authMiddleware, que valida el token JWT.
    const user = await userService.getCurrentUser(req.user.id);

    res.json({ user });
  } catch (error) {
    // Enviamos el error al middleware central de errores.
    next(error);
  }
}

async function getMyPlans(req, res, next) {
  try {
    // Devuelve los planes comprados por el usuario logueado.
    // El id del usuario se obtiene del token, no del frontend.
    const plans = await userService.getCurrentUserPlans(req.user.id);

    res.json({ plans });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMe,
  getMyPlans,
};