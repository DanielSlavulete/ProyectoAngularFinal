const orderService = require('../services/order.service');

async function createOrder(req, res, next) {
  try {
    // Recibimos desde Angular los items del carrito y el método de pago simulado.
    const { items, paymentMethod } = req.body;

    // Creamos el pedido para el usuario logueado.
    // req.user.id viene del token JWT validado por authMiddleware.
    // La lógica real de crear orders, order_items y user_plans está en order.service.js.
    const order = await orderService.createOrder(
      req.user.id,
      items,
      paymentMethod || 'CARD'
    );

    res.status(201).json({ order });
  } catch (error) {
    // Enviamos cualquier error al middleware central de errores.
    next(error);
  }
}

async function getOrders(req, res, next) {
  try {
    // Devuelve el historial de pedidos del usuario logueado.
    // No se recibe el userId desde Angular por seguridad; se obtiene del token.
    const orders = await orderService.getOrdersByUser(req.user.id);

    res.json({ orders });
  } catch (error) {
    next(error);
  }
}

async function getOrder(req, res, next) {
  try {
    // Devuelve un pedido concreto siempre que pertenezca al usuario logueado.
    // req.params.id viene de la URL: /api/orders/:id
    const order = await orderService.getOrderById(req.params.id, req.user.id);

    res.json({ order });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrder,
};