const express = require('express');
const boardController = require('../controllers/board.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, boardController.getBoards);
router.post('/', authMiddleware, boardController.createBoard);
router.get('/:id', authMiddleware, boardController.getBoard);
router.put('/:id', authMiddleware, boardController.updateBoard);
router.delete('/:id', authMiddleware, boardController.deleteBoard);

module.exports = router;
