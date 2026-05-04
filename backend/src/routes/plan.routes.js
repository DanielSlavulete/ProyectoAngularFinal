const express = require('express');
const planController = require('../controllers/plan.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, planController.getPlans);
router.get('/:id', authMiddleware, planController.getPlan);

module.exports = router;
