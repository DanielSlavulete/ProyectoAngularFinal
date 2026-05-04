const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

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
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error('Ya existe un usuario con ese email');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER',
    },
  });

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
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error('Credenciales incorrectas');
    error.statusCode = 401;
    throw error;
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);

  if (!passwordIsValid) {
    const error = new Error('Credenciales incorrectas');
    error.statusCode = 401;
    throw error;
  }

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
