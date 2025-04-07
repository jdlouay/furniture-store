const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  furniture: {
    type: mongoose.Schema.ObjectId,
    ref: 'Furniture',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    street: {
      type: String,
      required: [true, 'Veuillez fournir une rue']
    },
    city: {
      type: String,
      required: [true, 'Veuillez fournir une ville']
    },
    postalCode: {
      type: String,
      required: [true, 'Veuillez fournir un code postal']
    },
    country: {
      type: String,
      required: [true, 'Veuillez fournir un pays']
    }
  },
  paymentMethod: {
    type: String,
    required: [true, 'Veuillez fournir une méthode de paiement'],
    enum: ['carte', 'paypal']
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  status: {
    type: String,
    required: true,
    enum: ['en attente', 'payée', 'expédiée', 'livrée', 'annulée'],
    default: 'en attente'
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour peupler les informations des meubles
orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email'
  }).populate({
    path: 'items.furniture',
    select: 'name imageUrl'
  });
  next();
});

module.exports = mongoose.model('Order', orderSchema); 