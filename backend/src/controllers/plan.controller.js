const planService = require('../services/plan.service');

async function getPlans(req, res, next) {
  try {
    const plans = await planService.getActivePlans();
    res.json({ plans });
  } catch (error) {
    next(error);
  }
}

async function getPlan(req, res, next) {
  try {
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