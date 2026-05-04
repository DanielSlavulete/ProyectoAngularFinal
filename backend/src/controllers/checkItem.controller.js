const checkItemService = require('../services/checkItem.service');

async function getCheckItemsByNote(req, res, next) {
  try {
    const checkItems = await checkItemService.getCheckItemsByNote(
      req.params.noteId,
      req.user.id
    );

    res.json({ checkItems });
  } catch (error) {
    next(error);
  }
}

async function createCheckItem(req, res, next) {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 2) {
      return res.status(400).json({
        message: 'El texto debe tener al menos 2 caracteres',
      });
    }

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

    if (!text || text.trim().length < 2) {
      return res.status(400).json({
        message: 'El texto debe tener al menos 2 caracteres',
      });
    }

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
