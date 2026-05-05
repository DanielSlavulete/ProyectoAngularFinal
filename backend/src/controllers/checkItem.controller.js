const checkItemService = require('../services/checkItem.service');

async function getCheckItemsByNote(req, res, next) {
  try {
    // Devuelve los elementos de checklist de una nota concreta.
    // noteId viene de la URL: /api/notes/:noteId/check-items
    // req.user.id viene del token JWT validado por authMiddleware.
    const checkItems = await checkItemService.getCheckItemsByNote(
      req.params.noteId,
      req.user.id
    );

    res.json({ checkItems });
  } catch (error) {
    // Enviamos el error al middleware central de errores.
    next(error);
  }
}

async function createCheckItem(req, res, next) {
  try {
    const { text } = req.body;

    // Validación básica para evitar crear elementos vacíos o demasiado cortos.
    if (!text || text.trim().length < 2) {
      return res.status(400).json({
        message: 'El texto debe tener al menos 2 caracteres',
      });
    }

    // Crea un nuevo elemento dentro del checklist de la nota.
    // El service comprueba que la nota pertenece al usuario logueado.
    const checkItem = await checkItemService.createCheckItem(
      req.params.noteId,
      req.user.id,
      { text }
    );

    res.status(201).json({ checkItem });
  } catch (error) {
    next(error);
  }
}

async function updateCheckItem(req, res, next) {
  try {
    const { text } = req.body;

    // Validación básica para editar el texto del elemento.
    if (!text || text.trim().length < 2) {
      return res.status(400).json({
        message: 'El texto debe tener al menos 2 caracteres',
      });
    }

    // Actualiza el texto de un elemento de checklist.
    // req.params.id viene de la URL: /api/check-items/:id
    const checkItem = await checkItemService.updateCheckItem(
      req.params.id,
      req.user.id,
      { text }
    );

    res.json({ checkItem });
  } catch (error) {
    next(error);
  }
}

async function toggleCheckItem(req, res, next) {
  try {
    // Marca o desmarca un elemento de checklist.
    // Es la acción que permite tachar/destachar visualmente en Angular.
    const checkItem = await checkItemService.toggleCheckItem(
      req.params.id,
      req.user.id
    );

    res.json({ checkItem });
  } catch (error) {
    next(error);
  }
}

async function deleteCheckItem(req, res, next) {
  try {
    // Elimina un elemento concreto del checklist.
    // El service valida antes que pertenezca al usuario logueado.
    const result = await checkItemService.deleteCheckItem(
      req.params.id,
      req.user.id
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCheckItemsByNote,
  createCheckItem,
  updateCheckItem,
  toggleCheckItem,
  deleteCheckItem,
};