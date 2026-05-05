const planService = require('../services/plan.service');

async function getPlans(req, res, next) {
  try {
    // Devuelve todos los planes activos disponibles para los usuarios.
    // La lógica de consulta a Supabase está separada en plan.service.js.
    const plans = await planService.getActivePlans();

    res.json({ plans });
  } catch (error) {
    // Si ocurre un error, lo enviamos al middleware central de errores.
    next(error);
  }
}

async function getPlan(req, res, next) {
  try {
    // Devuelve un plan concreto usando el id recibido por parámetro en la URL.
    // Ejemplo: GET /api/plans/1
    const plan = await planService.getActivePlanById(req.params.id);

    res.json({ plan });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPlans,
  getPlan,
};