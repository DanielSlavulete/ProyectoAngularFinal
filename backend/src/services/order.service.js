const prisma = require('../config/prisma');

// Formatea el pedido antes de enviarlo al frontend.
// Convertimos BigInt y Decimal a string para evitar problemas con JSON.
function formatOrder(order) {
  return {
    id: order.id.toString(),
    user_id: order.user_id.toString(),
    total: order.total.toString(),
    status: order.status,
    payment_method: order.payment_method,
    created_at: order.created_at,
    updated_at: order.updated_at,
    items: order.order_items?.map(formatOrderItem) || [],
  };
}

// Formatea cada línea del pedido.
// Incluye también los datos del plan comprado.
function formatOrderItem(item) {
  return {
    id: item.id.toString(),
    order_id: item.order_id.toString(),
    plan_id: item.plan_id.toString(),
    quantity: item.quantity,
    unit_price: item.unit_price.toString(),
    plan: item.plans
      ? {
          id: item.plans.id.toString(),
          name: item.plans.name,
          description: item.plans.description,
          price: item.plans.price.toString(),
          feature_key: item.plans.feature_key,
        }
      : null,
  };
}

async function createOrder(userId, items, paymentMethod = 'CARD') {
  // Validamos que el pedido tenga al menos un plan.
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('El pedido debe tener al menos un producto');
    error.statusCode = 400;
    throw error;
  }

  const planIds = items.map(item => BigInt(item.planId));

  // Buscamos los planes en Supabase y comprobamos que estén activos.
  // Importante: el backend recalcula precios desde BD, no se fía del precio enviado por Angular.
  const plans = await prisma.plans.findMany({
    where: {
      id: {
        in: planIds,
      },
      is_active: true,
    },
  });

  if (plans.length !== items.length) {
    const error = new Error('Uno o más planes no existen o no están activos');
    error.statusCode = 400;
    throw error;
  }

  // Preparamos los datos del pedido calculando cantidad, precio unitario y subtotal.
  const orderItemsData = items.map(item => {
    const plan = plans.find(currentPlan => currentPlan.id === BigInt(item.planId));

    const quantity = item.quantity || 1;
    const unitPrice = Number(plan.price);
    const subtotal = unitPrice * quantity;

    return {
      plan,
      quantity,
      unitPrice,
      subtotal,
    };
  });

  const total = orderItemsData.reduce((sum, item) => sum + item.subtotal, 0);

  // Transacción: asegura que se cree todo o no se cree nada.
  // Creamos:
  // 1. orders
  // 2. order_items
  // 3. user_plans para activar los planes comprados
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.orders.create({
      data: {
        user_id: BigInt(userId),
        total,
        status: 'PAID',
        payment_method: paymentMethod,
      },
    });

    await tx.order_items.createMany({
      data: orderItemsData.map(item => ({
        order_id: createdOrder.id,
        plan_id: item.plan.id,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      })),
    });

    await tx.user_plans.createMany({
      data: orderItemsData.map(item => ({
        user_id: BigInt(userId),
        plan_id: item.plan.id,
        order_id: createdOrder.id,
      })),
    });

    return tx.orders.findUnique({
      where: {
        id: createdOrder.id,
      },
      include: {
        order_items: {
          include: {
            plans: true,
          },
        },
      },
    });
  });

  return formatOrder(order);
}

async function getOrdersByUser(userId) {
  // Devuelve el historial de pedidos del usuario logueado.
  // userId viene del token JWT validado por authMiddleware.
  const orders = await prisma.orders.findMany({
    where: {
      user_id: BigInt(userId),
    },
    include: {
      order_items: {
        include: {
          plans: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return orders.map(formatOrder);
}

async function getOrderById(orderId, userId) {
  // Busca un pedido concreto, asegurando que pertenece al usuario logueado.
  const order = await prisma.orders.findFirst({
    where: {
      id: BigInt(orderId),
      user_id: BigInt(userId),
    },
    include: {
      order_items: {
        include: {
          plans: true,
        },
      },
    },
  });

  if (!order) {
    const error = new Error('Pedido no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return formatOrder(order);
}

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById,
};