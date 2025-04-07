const Cart = require('../models/cart.model');
const Furniture = require('../models/furniture.model');

// @desc    Obtenir le panier de l'utilisateur
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const total = cart.calculateTotal();

    res.status(200).json({
      success: true,
      data: cart,
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter un article au panier
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { furnitureId, quantity } = req.body;

    // Vérifier si le meuble existe et s'il y a assez de stock
    const furniture = await Furniture.findById(furnitureId);
    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: 'Meuble non trouvé'
      });
    }

    if (furniture.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuffisant'
      });
    }

    // Trouver ou créer le panier
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Vérifier si l'article existe déjà dans le panier
    const itemIndex = cart.items.findIndex(
      item => item.furniture._id.toString() === furnitureId
    );

    if (itemIndex > -1) {
      // Mettre à jour la quantité si l'article existe déjà
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Ajouter le nouvel article
      cart.items.push({ furniture: furnitureId, quantity });
    }

    await cart.save();
    await cart.populate('items.furniture');

    const total = cart.calculateTotal();

    res.status(200).json({
      success: true,
      data: cart,
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour la quantité d'un article
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Panier non trouvé'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé dans le panier'
      });
    }

    // Vérifier le stock
    const furniture = await Furniture.findById(cart.items[itemIndex].furniture);
    if (furniture.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuffisant'
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const total = cart.calculateTotal();

    res.status(200).json({
      success: true,
      data: cart,
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un article du panier
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Panier non trouvé'
      });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );

    await cart.save();

    const total = cart.calculateTotal();

    res.status(200).json({
      success: true,
      data: cart,
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vider le panier
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Panier non trouvé'
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
      total: 0
    });
  } catch (error) {
    next(error);
  }
}; 