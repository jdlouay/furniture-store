require('dotenv').config();
const mongoose = require('mongoose');
const Furniture = require('../models/furniture.model');
const User = require('../models/user.model');

const sampleFurniture = [
  {
    name: 'Canapé d\'angle moderne',
    description: 'Canapé d\'angle confortable et élégant, parfait pour votre salon. Revêtement en tissu de haute qualité et assises moelleuses.',
    price: 999.99,
    category: 'salon',
    imageUrl: 'https://example.com/canape-angle.jpg',
    stock: 10,
    dimensions: {
      length: 280,
      width: 180,
      height: 85
    },
    material: 'Tissu',
    color: 'Gris'
  },
  {
    name: 'Lit king size contemporain',
    description: 'Lit king size avec tête de lit capitonnée et rangements intégrés. Design contemporain et finitions soignées.',
    price: 799.99,
    category: 'chambre',
    imageUrl: 'https://example.com/lit-king.jpg',
    stock: 5,
    dimensions: {
      length: 200,
      width: 180,
      height: 120
    },
    material: 'Bois et tissu',
    color: 'Beige'
  },
  {
    name: 'Table à manger extensible',
    description: 'Table à manger extensible en chêne massif. Parfaite pour les repas en famille ou entre amis.',
    price: 699.99,
    category: 'salle-a-manger',
    imageUrl: 'https://example.com/table-manger.jpg',
    stock: 8,
    dimensions: {
      length: 180,
      width: 90,
      height: 75
    },
    material: 'Chêne massif',
    color: 'Naturel'
  },
  {
    name: 'Bureau ergonomique',
    description: 'Bureau ergonomique avec réglage en hauteur électrique et passe-câbles intégré.',
    price: 449.99,
    category: 'bureau',
    imageUrl: 'https://example.com/bureau.jpg',
    stock: 15,
    dimensions: {
      length: 140,
      width: 70,
      height: 75
    },
    material: 'Métal et bois',
    color: 'Blanc'
  },
  {
    name: 'Armoire de cuisine moderne',
    description: 'Armoire de cuisine avec nombreux rangements et système de fermeture douce.',
    price: 599.99,
    category: 'cuisine',
    imageUrl: 'https://example.com/armoire-cuisine.jpg',
    stock: 6,
    dimensions: {
      length: 120,
      width: 60,
      height: 200
    },
    material: 'MDF laqué',
    color: 'Blanc mat'
  }
];

const sampleAdmin = {
  email: 'admin@example.com',
  password: 'admin123',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin'
};

const seedDatabase = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    // Supprimer les données existantes
    await Furniture.deleteMany();
    await User.deleteMany();
    console.log('Données existantes supprimées');

    // Créer l'administrateur
    await User.create(sampleAdmin);
    console.log('Administrateur créé');

    // Insérer les meubles
    await Furniture.insertMany(sampleFurniture);
    console.log('Meubles insérés');

    console.log('Base de données initialisée avec succès');
    process.exit();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
};

seedDatabase(); 