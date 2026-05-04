const prisma = require('../config/prisma');

function formatNote(note) {
  return {
    id: note.id.toString(),
    board_id: note.board_id.toString(),
    title: note.title,
    content: note.content,
    color: note.color,
    order_index: note.order_index,
    created_at: note.created_at,
    updated_at: note.updated_at,
    check_items_count: note._count?.check_items ?? 0,
  };
}

async function checkBoardOwnership(boardId, userId) {
  const board = await prisma.boards.findFirst({
    where: {
      id: BigInt(boardId),
      owner_id: BigInt(userId),
    },
  });

  if (!board) {
    const error = new Error('Tablero no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return board;
}

async function getNotesByBoard(boardId, userId) {
  await checkBoardOwnership(boardId, userId);

  const notes = await prisma.notes.findMany({
    where: {
      board_id: BigInt(boardId),
    },
    include: {
      _count: {
        select: {
          check_items: true,
        },
      },
    },
    orderBy: {
      order_index: 'asc',
    },
  });

  return notes.map(formatNote);
}

async function createNote(boardId, userId, data) {
  await checkBoardOwnership(boardId, userId);

  const lastNote = await prisma.notes.findFirst({
    where: {
      board_id: BigInt(boardId),
    },
    orderBy: {
      order_index: 'desc',
    },
  });

  const nextOrderIndex = lastNote ? lastNote.order_index + 1 : 0;

  const note = await prisma.notes.create({
    data: {
      board_id: BigInt(boardId),
      title: data.title,
      content: data.content || null,
      color: data.color || '#facc15',
      order_index: nextOrderIndex,
    },
    include: {
      _count: {
        select: {
          check_items: true,
        },
      },
    },
  });

  return formatNote(note);
}

async function getNoteById(noteId, userId) {
  const note = await prisma.notes.findFirst({
    where: {
      id: BigInt(noteId),
      boards: {
        owner_id: BigInt(userId),
      },
    },
    include: {
      _count: {
        select: {
          check_items: true,
        },
      },
    },
  });

  if (!note) {
    const error = new Error('Nota no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return formatNote(note);
}

async function updateNote(noteId, userId, data) {
  await getNoteById(noteId, userId);

  const note = await prisma.notes.update({
    where: {
      id: BigInt(noteId),
    },
    data: {
      title: data.title,
      content: data.content || null,
      color: data.color,
      updated_at: new Date(),
    },
    include: {
      _count: {
        select: {
          check_items: true,
        },
      },
    },
  });

  return formatNote(note);
}

async function deleteNote(noteId, userId) {
  await getNoteById(noteId, userId);

  await prisma.notes.delete({
    where: {
      id: BigInt(noteId),
    },
  });

  return {
    message: 'Nota eliminada correctamente',
  };
}

async function reorderNotes(userId, notes) {
  if (!Array.isArray(notes)) {
    const error = new Error('Formato de notas inválido');
    error.statusCode = 400;
    throw error;
  }

  if (notes.length === 0) {
    return {
      message: 'No hay notas para reordenar',
    };
  }

  for (const noteItem of notes) {
    if (!noteItem.id && noteItem.id !== 0) {
      const error = new Error('Cada nota debe tener un id');
      error.statusCode = 400;
      throw error;
    }

    if (typeof noteItem.order_index !== 'number') {
      const error = new Error('Cada nota debe tener un order_index numérico');
      error.statusCode = 400;
      throw error;
    }

    const note = await prisma.notes.findFirst({
      where: {
        id: BigInt(noteItem.id),
        boards: {
          owner_id: BigInt(userId),
        },
      },
    });

    if (!note) {
      const error = new Error('Una de las notas no existe o no pertenece al usuario');
      error.statusCode = 404;
      throw error;
    }
  }

  await prisma.$transaction(
    notes.map((noteItem) =>
      prisma.notes.update({
        where: {
          id: BigInt(noteItem.id),
        },
        data: {
          order_index: noteItem.order_index,
          updated_at: new Date(),
        },
      })
    )
  );

  return {
    message: 'Notas reordenadas correctamente',
  };
}

module.exports = {
  getNotesByBoard,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  reorderNotes,
};