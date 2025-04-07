const mongoose = require('mongoose');

const furnitureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez fournir un nom'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'Veuillez fournir une description'],
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  price: {
    type: Number,
    required: [true, 'Veuillez fournir un prix'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  category: {
    type: String,
    required: [true, 'Veuillez fournir une catégorie'],
    enum: [
      'salon',
      'chambre',
      'salle-a-manger',
      'bureau',
      'cuisine',
      'salle-de-bain',
      'exterieur'
    ]
  },
  imageUrl: {
    type: String,
    required: [true, 'Veuillez fournir une image']
  },
  stock: {
    type: Number,
    required: [true, 'Veuillez fournir une quantité en stock'],
    min: [0, 'Le stock ne peut pas être négatif']
  },
  dimensions: {
    length: {
      type: Number,
      required: [true, 'Veuillez fournir une longueur']
    },
    width: {
      type: Number,
      required: [true, 'Veuillez fournir une largeur']
    },
    height: {
      type: Number,
      required: [true, 'Veuillez fournir une hauteur']
    }
  },
  material: {
    type: String,
    required: [true, 'Veuillez fournir le matériau principal']
  },
  color: {
    type: String,
    required: [true, 'Veuillez fournir la couleur']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour la recherche
furnitureSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Furniture', furnitureSchema); 