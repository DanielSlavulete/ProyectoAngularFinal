const prisma = require('../config/prisma');

// Formatea los planes antes de enviarlos al frontend.
// Convertimos BigInt y Decimal a string para evitar problemas al serializar JSON.
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
  // Devuelve solo los planes activos disponibles para los usuarios.
  // Es el endpoint que usa la página /plans del frontend.
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
  // Busca un plan concreto siempre que esté activo.
  // Si está inactivo o no existe, se trata como no disponible.
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