const boardService = require('../services/board.service');

async function getBoards(req, res, next) {
  try {
    const boards = await boardService.getBoardsByUser(req.user.id);
    res.json({ boards });
  } catch (error) {
    next(error);
  }
}

async function getBoard(req, res, next) {
  try {
    const board = await boardService.getBoardById(req.params.id, req.user.id);
    res.json({ board });
  } catch (error) {
    next(error);
  }
}

async function createBoard(req, res, next) {
  try {
    const { title, description, color, background_theme } = req.body;

    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        message: 'El título debe tener al menos 2 caracteres',
      });
    }

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

    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        message: 'El título debe tener al menos 2 caracteres',
      });
    }

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
