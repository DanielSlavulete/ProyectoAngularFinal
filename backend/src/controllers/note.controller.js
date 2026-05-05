const noteService = require('../services/note.service');

async function getNotesByBoard(req, res, next) {
  try {
    // Devuelve las notas de un tablero concreto.
    // boardId viene de la URL: /api/boards/:boardId/notes
    // req.user.id viene del token JWT validado por authMiddleware.
    const notes = await noteService.getNotesByBoard(req.params.boardId, req.user.id);

    res.json({ notes });
  } catch (error) {
    // Enviamos el error al middleware central de errores.
    next(error);
  }
}

async function createNote(req, res, next) {
  try {
    const { title, content, color } = req.body;

    // Validación básica antes de llamar al service.
    // Evita crear notas sin título o con títulos demasiado cortos.
    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        message: 'El título de la nota debe tener al menos 2 caracteres',
      });
    }

    // Crea la nota dentro del tablero indicado.
    // El service comprueba que el tablero pertenece al usuario logueado.
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
    // Devuelve una nota concreta.
    // El service valida que la nota pertenezca a un tablero del usuario.
    const note = await noteService.getNoteById(req.params.id, req.user.id);

    res.json({ note });
  } catch (error) {
    next(error);
  }
}

async function updateNote(req, res, next) {
  try {
    const { title, content, color } = req.body;

    // Validación básica para no permitir notas sin título válido.
    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        message: 'El título de la nota debe tener al menos 2 caracteres',
      });
    }

    // Actualiza una nota existente.
    // req.params.id viene de la URL: /api/notes/:id
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
    // Elimina una nota concreta.
    // Los check_items asociados se eliminan por cascada en la base de datos.
    const result = await noteService.deleteNote(req.params.id, req.user.id);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function reorderNotes(req, res, next) {
  try {
    const { notes } = req.body;

    // Endpoint usado por Angular CDK Drag & Drop.
    // Recibe el nuevo orden de las notas y actualiza order_index en Supabase.
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