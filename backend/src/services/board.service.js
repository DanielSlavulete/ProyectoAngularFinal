const prisma = require('../config/prisma');

// Formatea un tablero antes de enviarlo al frontend.
// Convertimos BigInt a string y añadimos el número de notas asociadas.
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
  // Devuelve solo los tableros del usuario logueado.
  // userId viene del token JWT validado previamente por authMiddleware.
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
  // Busca un tablero concreto asegurando que pertenece al usuario logueado.
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
  // Crea un tablero asociado al usuario autenticado.
  // owner_id se obtiene del token, no desde el frontend.
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
  // Primero comprobamos que el tablero existe y pertenece al usuario.
  // Así evitamos que un usuario pueda editar tableros de otro.
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
  // Validamos permisos antes de eliminar.
  // Las notas y check_items asociados se eliminan por las relaciones en cascada.
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