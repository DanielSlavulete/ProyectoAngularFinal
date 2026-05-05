const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// Limpia el objeto usuario antes de enviarlo al frontend.
// No devolvemos la contraseña y convertimos BigInt a string para evitar errores JSON.
function sanitizeUser(user) {
  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar_url: user.avatar_url,
    name_color: user.name_color,
    name_badge: user.name_badge,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

async function registerUser({ name, email, password }) {
  // Comprobamos si ya existe un usuario con ese email para evitar duplicados.
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error('Ya existe un usuario con ese email');
    error.statusCode = 409;
    throw error;
  }

  // Hasheamos la contraseña antes de guardarla.
  // Nunca se guarda la contraseña en texto plano en la base de datos.
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER',
    },
  });

  // Generamos un token JWT con los datos mínimos necesarios.
  // Este token servirá para autenticar futuras peticiones protegidas.
  const token = jwt.sign(
    {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: sanitizeUser(user),
    token,
  };
}

async function loginUser({ email, password }) {
  // Buscamos el usuario por email.
  const user = await prisma.users.findUnique({
    where: { email },
  });

  // Usamos un mensaje genérico para no revelar si el email existe o no.
  if (!user) {
    const error = new Error('Credenciales incorrectas');
    error.statusCode = 401;
    throw error;
  }

  // Comparamos la contraseña introducida con el hash guardado en la base de datos.
  const passwordIsValid = await bcrypt.compare(password, user.password);

  if (!passwordIsValid) {
    const error = new Error('Credenciales incorrectas');
    error.statusCode = 401;
    throw error;
  }

  // Si las credenciales son correctas, generamos un nuevo JWT.
  const token = jwt.sign(
    {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: sanitizeUser(user),
    token,
  };
}

async function getUserById(userId) {
  // Busca un usuario por id. Se usa, por ejemplo, para rutas protegidas como /me.
  // El userId normalmente viene del token JWT validado por authMiddleware.
  const user = await prisma.users.findUnique({
    where: {
      id: BigInt(userId),
    },
  });

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};