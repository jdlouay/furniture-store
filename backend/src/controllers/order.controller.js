const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Furniture = require('../models/furniture.model');

// @desc    Créer une nouvelle commande
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Récupérer le panier de l'utilisateur
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Panier vide'
      });
    }

    // Vérifier le stock pour chaque article
    for (const item of cart.items) {
      const furniture = await Furniture.findById(item.furniture);
      if (!furniture || furniture.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${furniture ? furniture.name : 'un article'}`
        });
      }
    }

    // Créer les articles de la commande avec les prix actuels
    const orderItems = await Promise.all(cart.items.map(async (item) => {
      const furniture = await Furniture.findById(item.furniture);
      return {
        furniture: item.furniture,
        quantity: item.quantity,
        price: furniture.price
      };
    }));

    // Calculer le prix total
    const totalPrice = orderItems.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    // Créer la commande
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    // Mettre à jour le stock
    for (const item of orderItems) {
      await Furniture.findByIdAndUpdate(item.furniture, {
        $inc: { stock: -item.quantity }
      });
    }

    // Vider le panier
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir toutes les commandes
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les commandes de l'utilisateur
// @route   GET /api/orders/me
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir une commande par ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier que l'utilisateur est autorisé à voir cette commande
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à voir cette commande'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le statut de paiement
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier que l'utilisateur est autorisé
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette commande'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'payée';
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le statut de livraison
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'livrée';

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Annuler une commande
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier que l'utilisateur est autorisé
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à annuler cette commande'
      });
    }

    // Vérifier que la commande peut être annulée
    if (order.status !== 'en attente' && order.status !== 'payée') {
      return res.status(400).json({
        success: false,
        message: 'Cette commande ne peut plus être annulée'
      });
    }

    // Remettre les articles en stock
    for (const item of order.items) {
      await Furniture.findByIdAndUpdate(item.furniture, {
        $inc: { stock: item.quantity }
      });
    }

    order.status = 'annulée';
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
}; 