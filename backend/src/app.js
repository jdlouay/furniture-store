const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Configuration CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200'
}));

// Parser JSON
app.use(express.json());

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/assets', express.static(path.join(__dirname, '../../frontend/src/assets')));

// Routes
const authRoutes = require('./routes/auth.routes');
const furnitureRoutes = require('./routes/furniture.routes');

app.use('/api/auth', authRoutes);
app.use('/api/furniture', furnitureRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Une erreur est survenue sur le serveur'
  });
});

module.exports = app; 