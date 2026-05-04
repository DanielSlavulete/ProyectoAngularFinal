require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const boardRoutes = require('./routes/board.routes');
const noteRoutes = require('./routes/note.routes');
const checkItemRoutes = require('./routes/checkItem.routes');
const planRoutes = require('./routes/plan.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API funcionando correctamente',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api', noteRoutes);
app.use('/api', checkItemRoutes);
app.use('/api/plans', planRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    message: err.message || 'Error interno del servidor',
  });
});

module.exports = app;
