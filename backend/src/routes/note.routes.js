const express = require('express');
const noteController = require('../controllers/note.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/boards/:boardId/notes', authMiddleware, noteController.getNotesByBoard);
router.post('/boards/:boardId/notes', authMiddleware, noteController.createNote);

router.patch('/notes/reorder', authMiddleware, noteController.reorderNotes);

router.get('/notes/:id', authMiddleware, noteController.getNote);
router.put('/notes/:id', authMiddleware, noteController.updateNote);
router.delete('/notes/:id', authMiddleware, noteController.deleteNote);

module.exports = router;