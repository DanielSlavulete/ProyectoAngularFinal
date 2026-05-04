const prisma = require('../config/prisma');

function formatPlan(plan) {
  return {
    id: plan.id.toString(),
    name: plan.name,
    description: plan.description,
    price: plan.price.toString(),
    feature_key: plan.feature_key,
    is_active: plan.is_active,
    created_at: plan.created_at,
    updated_at: plan.updated_at,
  };
}

async function getActivePlans() {
  const plans = await prisma.plans.findMany({
    where: {
      is_active: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  return plans.map(formatPlan);
}

async function getActivePlanById(planId) {
  const plan = await prisma.plans.findFirst({
    where: {
      id: BigInt(planId),
      is_active: true,
    },
  });

  if (!plan) {
    const error = new Error('Plan no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return formatPlan(plan);
}

module.exports = {
  getActivePlans,
  getActivePlanById,
};
