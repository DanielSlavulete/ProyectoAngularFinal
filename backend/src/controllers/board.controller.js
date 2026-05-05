const boardService = require('../services/board.service');

async function getBoards(req, res, next) {
  try {
    // Devuelve los tableros del usuario logueado.
    // req.user.id viene del token JWT validado por authMiddleware.
    const boards = await boardService.getBoardsByUser(req.user.id);

    res.json({ boards });
  } catch (error) {
    // Enviamos cualquier error al middleware central de errores.
    next(error);
  }
}

async function getBoard(req, res, next) {
  try {
    // Devuelve un tablero concreto usando el id de la URL.
    // El service comprueba que el tablero pertenece al usuario logueado.
    const board = await boardService.getBoardById(req.params.id, req.user.id);

    res.json({ board });
  } catch (error) {
    next(error);
  }
}

async function createBoard(req, res, next) {
  try {
    const { title, description, color, background_theme } = req.body;

    // Validación básica antes de llamar al service.
    // Evita crear tableros sin título o con títulos demasiado cortos.
    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        message: 'El título debe tener al menos 2 caracteres',
      });
    }

    // Crea un tablero asociado al usuario autenticado.
    // El owner_id no viene del frontend, se obtiene desde req.user.id.
    const board = await boardService.createBoard(req.user.id, {
      title,
      description,
      color,
      background_theme,
    });

    res.status(201).json({ board });
  } catch (error) {
    next(error);
  }
}

async function updateBoard(req, res, next) {
  try {
    const { title, description, color, background_theme } = req.body;

    // Validación básica para no permitir tableros sin título válido.
    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        message: 'El título debe tener al menos 2 caracteres',
      });
    }

    // Actualiza un tablero existente.
    // req.params.id viene de la URL: /api/boards/:id
    // El service valida que el tablero pertenezca al usuario.
    const board = await boardService.updateBoard(req.params.id, req.user.id, {
      title,
      description,
      color,
      background_theme,
    });

    res.json({ board });
  } catch (error) {
    next(error);
  }
}

async function deleteBoard(req, res, next) {
  try {
    // Elimina un tablero concreto.
    // El service valida permisos antes de borrar.
    const result = await boardService.deleteBoard(req.params.id, req.user.id);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
};