const adminService = require('../services/admin.service');

async function getDashboardStats(req, res, next) {
  try {
    const stats = await adminService.getDashboardStats();

    res.json({ stats });
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await adminService.getAllUsers();

    res.json({ users });
  } catch (error) {
    next(error);
  }
}

async function getBoards(req, res, next) {
  try {
    const boards = await adminService.getAllBoards();

    res.json({ boards });
  } catch (error) {
    next(error);
  }
}

async function getOrders(req, res, next) {
  try {
    const orders = await adminService.getAllOrders();

    res.json({ orders });
  } catch (error) {
    next(error);
  }
}

async function getPlans(req, res, next) {
  try {
    const plans = await adminService.getAllPlans();

    res.json({ plans });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats,
  getUsers,
  getBoards,
  getOrders,
  getPlans,
};
