const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  furniture: {
    type: mongoose.Schema.ObjectId,
    ref: 'Furniture',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'La quantité doit être au moins 1']
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour peupler les informations des meubles
cartSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'items.furniture',
    select: 'name price imageUrl stock'
  });
  next();
});

// Méthode pour calculer le total du panier
cartSchema.methods.calculateTotal = function() {
  return this.items.reduce((total, item) => {
    return total + (item.furniture.price * item.quantity);
  }, 0);
};

module.exports = mongoose.model('Cart', cartSchema); 