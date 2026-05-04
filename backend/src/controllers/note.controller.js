const noteService = require('../services/note.service');

async function getNotesByBoard(req, res, next) {
  try {
    const notes = await noteService.getNotesByBoard(req.params.boardId, req.user.id);
    res.json({ notes });
  } catch (error) {
    next(error);
  }
}

async function createNote(req, res, next) {
  try {
    const { title, content, color } = req.body;

    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        message: 'El título de la nota debe tener al menos 2 caracteres',
      });
    }

    const note = await noteService.createNote(req.params.boardId, req.user.id, {
      title,
      content,
      color,
    });

    res.status(201).json({ note });
  } catch (error) {
    next(error);
  }
}

async function getNote(req, res, next) {
  try {
    const note = await noteService.getNoteById(req.params.id, req.user.id);
    res.json({ note });
  } catch (error) {
    next(error);
  }
}

async function updateNote(req, res, next) {
  try {
    const { title, content, color } = req.body;

    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        message: 'El título de la nota debe tener al menos 2 caracteres',
      });
    }

    const note = await noteService.updateNote(req.params.id, req.user.id, {
      title,
      content,
      color,
    });

    res.json({ note });
  } catch (error) {
    next(error);
  }
}

async function deleteNote(req, res, next) {
  try {
    const result = await noteService.deleteNote(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function reorderNotes(req, res, next) {
  try {
    const { notes } = req.body;

    const result = await noteService.reorderNotes(req.user.id, notes);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotesByBoard,
  createNote,
  getNote,
  updateNote,
  deleteNote,
  reorderNotes,
};