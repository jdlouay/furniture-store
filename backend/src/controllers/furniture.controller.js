const Furniture = require('../models/furniture.model');

// @desc    Obtenir tous les meubles
// @route   GET /api/furniture
// @access  Public
exports.getFurniture = async (req, res, next) => {
  try {
    const { category, search, sort, page = 1, limit = 10 } = req.query;
    const query = {};

    // Filtrer par catégorie
    if (category) {
      query.category = category;
    }

    // Recherche textuelle
    if (search) {
      query.$text = { $search: search };
    }

    // Options de tri
    let sortOption = {};
    if (sort) {
      const [field, order] = sort.split(':');
      sortOption[field] = order === 'desc' ? -1 : 1;
    } else {
      sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const furniture = await Furniture.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Furniture.countDocuments(query);

    res.status(200).json({
      success: true,
      count: furniture.length,
      total,
      data: furniture,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un meuble par ID
// @route   GET /api/furniture/:id
// @access  Public
exports.getFurnitureById = async (req, res, next) => {
  try {
    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: 'Meuble non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: furniture
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un meuble
// @route   POST /api/furniture
// @access  Private/Admin
exports.createFurniture = async (req, res, next) => {
  try {
    const furniture = await Furniture.create(req.body);

    res.status(201).json({
      success: true,
      data: furniture
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un meuble
// @route   PUT /api/furniture/:id
// @access  Private/Admin
exports.updateFurniture = async (req, res, next) => {
  try {
    const furniture = await Furniture.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: 'Meuble non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: furniture
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un meuble
// @route   DELETE /api/furniture/:id
// @access  Private/Admin
exports.deleteFurniture = async (req, res, next) => {
  try {
    const furniture = await Furniture.findByIdAndDelete(req.params.id);

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: 'Meuble non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 