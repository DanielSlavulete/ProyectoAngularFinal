const express = require('express');
const checkItemController = require('../controllers/checkItem.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/notes/:noteId/check-items', authMiddleware, checkItemController.getCheckItemsByNote);
router.post('/notes/:noteId/check-items', authMiddleware, checkItemController.createCheckItem);

router.put('/check-items/:id', authMiddleware, checkItemController.updateCheckItem);
router.patch('/check-items/:id/toggle', authMiddleware, checkItemController.toggleCheckItem);
router.delete('/check-items/:id', authMiddleware, checkItemController.deleteCheckItem);

module.exports = router;
