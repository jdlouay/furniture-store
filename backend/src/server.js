require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const morgan = require('morgan');

// Vérification des variables d'environnement
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Port:', process.env.PORT);
console.log('CORS Origin:', process.env.CORS_ORIGIN);

// Import des routes
const authRoutes = require('./routes/auth.routes');
const furnitureRoutes = require('./routes/furniture.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');

// Import des middlewares
const errorHandler = require('./middleware/error.middleware');
const { protect } = require('./middleware/auth.middleware');

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Configuration MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'furniture_store'
});

// Connexion à MySQL
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    process.exit(1);
  }
  console.log('Connecté à MySQL');
});

// Rendre la connexion disponible globalement
global.db = db;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/furniture', furnitureRoutes);
app.use('/api/cart', protect, cartRoutes);
app.use('/api/orders', protect, orderRoutes);

// Gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 