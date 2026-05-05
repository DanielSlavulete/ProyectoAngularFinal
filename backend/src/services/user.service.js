const prisma = require('../config/prisma');

// Formatea el usuario antes de enviarlo al frontend.
// Convertimos BigInt a string y evitamos devolver campos sensibles como password.
function formatUser(user) {
  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar_url: user.avatar_url,
    name_color: user.name_color,
    name_badge: user.name_badge,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

// Formatea los planes comprados por el usuario.
// Incluye información de user_plans y también los datos del plan relacionado.
function formatUserPlan(userPlan) {
  return {
    id: userPlan.id.toString(),
    user_id: userPlan.user_id.toString(),
    plan_id: userPlan.plan_id.toString(),
    order_id: userPlan.order_id.toString(),
    purchased_at: userPlan.purchased_at,
    plan: {
      id: userPlan.plans.id.toString(),
      name: userPlan.plans.name,
      description: userPlan.plans.description,
      price: userPlan.plans.price.toString(),
      feature_key: userPlan.plans.feature_key,
      is_active: userPlan.plans.is_active,
    },
  };
}

async function getCurrentUser(userId) {
  // Busca en Supabase el usuario autenticado.
  // userId viene del token JWT validado previamente por el authMiddleware.
  const user = await prisma.users.findUnique({
    where: {
      id: BigInt(userId),
    },
  });

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return formatUser(user);
}

async function getCurrentUserPlans(userId) {
  // Consulta los planes comprados por el usuario logueado.
  // Incluimos la tabla plans para mostrar nombre, precio y feature_key en el perfil.
  const userPlans = await prisma.user_plans.findMany({
    where: {
      user_id: BigInt(userId),
    },
    include: {
      plans: true,
    },
    orderBy: {
      purchased_at: 'desc',
    },
  });

  return userPlans.map(formatUserPlan);
}

module.exports = {
  getCurrentUser,
  getCurrentUserPlans,
};