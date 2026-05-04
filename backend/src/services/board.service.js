const prisma = require('../config/prisma');

function formatBoard(board) {
  return {
    id: board.id.toString(),
    title: board.title,
    description: board.description,
    color: board.color,
    background_theme: board.background_theme,
    owner_id: board.owner_id.toString(),
    created_at: board.created_at,
    updated_at: board.updated_at,
    notes_count: board._count?.notes ?? 0,
  };
}

async function getBoardsByUser(userId) {
  const boards = await prisma.boards.findMany({
    where: {
      owner_id: BigInt(userId),
    },
    include: {
      _count: {
        select: {
          notes: true,
        },
      },
    },
    orderBy: {
      updated_at: 'desc',
    },
  });

  return boards.map(formatBoard);
}

async function getBoardById(boardId, userId) {
  const board = await prisma.boards.findFirst({
    where: {
      id: BigInt(boardId),
      owner_id: BigInt(userId),
    },
    include: {
      _count: {
        select: {
          notes: true,
        },
      },
    },
  });

  if (!board) {
    const error = new Error('Tablero no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return formatBoard(board);
}

async function createBoard(userId, data) {
  const board = await prisma.boards.create({
    data: {
      title: data.title,
      description: data.description || null,
      color: data.color || '#2563eb',
      background_theme: data.background_theme || 'Azul',
      owner_id: BigInt(userId),
    },
    include: {
      _count: {
        select: {
          notes: true,
        },
      },
    },
  });

  return formatBoard(board);
}

async function updateBoard(boardId, userId, data) {
  await getBoardById(boardId, userId);

  const board = await prisma.boards.update({
    where: {
      id: BigInt(boardId),
    },
    data: {
      title: data.title,
      description: data.description || null,
      color: data.color,
      background_theme: data.background_theme,
      updated_at: new Date(),
    },
    include: {
      _count: {
        select: {
          notes: true,
        },
      },
    },
  });

  return formatBoard(board);
}

async function deleteBoard(boardId, userId) {
  await getBoardById(boardId, userId);

  await prisma.boards.delete({
    where: {
      id: BigInt(boardId),
    },
  });

  return {
    message: 'Tablero eliminado correctamente',
  };
}

module.exports = {
  getBoardsByUser,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
};
