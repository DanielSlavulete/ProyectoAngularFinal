const prisma = require('../config/prisma');

// Formatea usuarios para devolverlos al panel admin.
// Se convierte BigInt a string y no se devuelve información sensible como password.
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

// Formatea tableros para el admin.
// Además de los datos del tablero, incluye el propietario y el número de notas.
function formatBoard(board) {
  return {
    id: board.id.toString(),
    title: board.title,
    description: board.description,
    color: board.color,
    background_theme: board.background_theme,
    owner_id: board.owner_id.toString(),
    owner: board.users
      ? {
          id: board.users.id.toString(),
          name: board.users.name,
          email: board.users.email,
        }
      : null,
    notes_count: board._count?.notes ?? 0,
    created_at: board.created_at,
    updated_at: board.updated_at,
  };
}

// Formatea planes para mostrarlos en el panel admin.
// Convertimos Decimal y BigInt a string para evitar errores al devolver JSON.
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

// Formatea pedidos para el admin.
// Incluye datos básicos del usuario que realizó el pedido y el número de planes comprados.
function formatOrder(order) {
  return {
    id: order.id.toString(),
    user_id: order.user_id.toString(),
    total: order.total.toString(),
    status: order.status,
    payment_method: order.payment_method,
    user: order.users
      ? {
          id: order.users.id.toString(),
          name: order.users.name,
          email: order.users.email,
        }
      : null,
    items_count: order._count?.order_items ?? 0,
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
}

async function getDashboardStats() {
  // Obtiene las estadísticas generales del dashboard admin.
  // Promise.all permite ejecutar varias consultas independientes en paralelo.
  const [
    usersCount,
    boardsCount,
    notesCount,
    ordersCount,
    activePlansCount,
    totalRevenueResult,
  ] = await Promise.all([
    prisma.users.count(),
    prisma.boards.count(),
    prisma.notes.count(),
    prisma.orders.count(),
    prisma.plans.count({
      where: {
        is_active: true,
      },
    }),
    prisma.orders.aggregate({
      _sum: {
        total: true,
      },
    }),
  ]);

  return {
    usersCount,
    boardsCount,
    notesCount,
    ordersCount,
    activePlansCount,
    totalRevenue: totalRevenueResult._sum.total
      ? totalRevenueResult._sum.total.toString()
      : '0',
  };
}

async function getAllUsers() {
  // Devuelve todos los usuarios registrados, ordenados por fecha de creación.
  const users = await prisma.users.findMany({
    orderBy: {
      created_at: 'desc',
    },
  });

  return users.map(formatUser);
}

async function getAllBoards() {
  // Devuelve todos los tableros del sistema.
  // Incluye el usuario propietario y el contador de notas.
  const boards = await prisma.boards.findMany({
    include: {
      users: true,
      _count: {
        select: {
          notes: true,
        },
      },
    },
    orderBy: {
      updated_at: 'desc',
    },
  });

  return boards.map(formatBoard);
}

async function getAllOrders() {
  // Devuelve todos los pedidos realizados por todos los usuarios.
  // Incluye el usuario comprador y cuántos items tiene cada pedido.
  const orders = await prisma.orders.findMany({
    include: {
      users: true,
      _count: {
        select: {
          order_items: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return orders.map(formatOrder);
}

async function getAllPlans() {
  // Devuelve todos los planes, activos e inactivos, para consulta del administrador.
  const plans = await prisma.plans.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  return plans.map(formatPlan);
}

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllBoards,
  getAllOrders,
  getAllPlans,
};