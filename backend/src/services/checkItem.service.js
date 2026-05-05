const prisma = require('../config/prisma');

// Formatea un elemento de checklist antes de enviarlo al frontend.
// Convertimos BigInt a string para evitar problemas al devolver JSON.
function formatCheckItem(checkItem) {
  return {
    id: checkItem.id.toString(),
    note_id: checkItem.note_id.toString(),
    text: checkItem.text,
    is_checked: checkItem.is_checked,
    order_index: checkItem.order_index,
    created_at: checkItem.created_at,
    updated_at: checkItem.updated_at,
  };
}

async function checkNoteOwnership(noteId, userId) {
  // Comprueba que la nota existe y pertenece a un tablero del usuario logueado.
  // userId viene del token JWT validado previamente por authMiddleware.
  const note = await prisma.notes.findFirst({
    where: {
      id: BigInt(noteId),
      boards: {
        owner_id: BigInt(userId),
      },
    },
  });

  if (!note) {
    const error = new Error('Nota no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return note;
}

async function getCheckItemById(checkItemId, userId) {
  // Busca un elemento concreto del checklist asegurando que pertenece al usuario.
  const checkItem = await prisma.check_items.findFirst({
    where: {
      id: BigInt(checkItemId),
      notes: {
        boards: {
          owner_id: BigInt(userId),
        },
      },
    },
  });

  if (!checkItem) {
    const error = new Error('Elemento de checklist no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return checkItem;
}

async function getCheckItemsByNote(noteId, userId) {
  // Antes de devolver los checks, validamos que el usuario tenga acceso a la nota.
  await checkNoteOwnership(noteId, userId);

  const checkItems = await prisma.check_items.findMany({
    where: {
      note_id: BigInt(noteId),
    },
    orderBy: {
      order_index: 'asc',
    },
  });

  return checkItems.map(formatCheckItem);
}

async function createCheckItem(noteId, userId, data) {
  await checkNoteOwnership(noteId, userId);

  // Calcula el siguiente order_index para colocar el nuevo check al final.
  const lastCheckItem = await prisma.check_items.findFirst({
    where: {
      note_id: BigInt(noteId),
    },
    orderBy: {
      order_index: 'desc',
    },
  });

  const nextOrderIndex = lastCheckItem ? lastCheckItem.order_index + 1 : 0;

  const checkItem = await prisma.check_items.create({
    data: {
      note_id: BigInt(noteId),
      text: data.text,
      is_checked: false,
      order_index: nextOrderIndex,
    },
  });

  return formatCheckItem(checkItem);
}

async function updateCheckItem(checkItemId, userId, data) {
  // Reutilizamos getCheckItemById para validar permisos antes de editar.
  await getCheckItemById(checkItemId, userId);

  const checkItem = await prisma.check_items.update({
    where: {
      id: BigInt(checkItemId),
    },
    data: {
      text: data.text,
      updated_at: new Date(),
    },
  });

  return formatCheckItem(checkItem);
}

async function toggleCheckItem(checkItemId, userId) {
  // Primero obtenemos el elemento actual para saber si está marcado o no.
  const existingCheckItem = await getCheckItemById(checkItemId, userId);

  // Cambia is_checked al valor contrario.
  // Es la parte que permite marcar/desmarcar y que en Angular se vea tachado.
  const checkItem = await prisma.check_items.update({
    where: {
      id: BigInt(checkItemId),
    },
    data: {
      is_checked: !existingCheckItem.is_checked,
      updated_at: new Date(),
    },
  });

  return formatCheckItem(checkItem);
}

async function deleteCheckItem(checkItemId, userId) {
  // Validamos permisos antes de eliminar el elemento del checklist.
  await getCheckItemById(checkItemId, userId);

  await prisma.check_items.delete({
    where: {
      id: BigInt(checkItemId),
    },
  });

  return {
    message: 'Elemento eliminado correctamente',
  };
}

module.exports = {
  getCheckItemsByNote,
  createCheckItem,
  updateCheckItem,
  toggleCheckItem,
  deleteCheckItem,
};