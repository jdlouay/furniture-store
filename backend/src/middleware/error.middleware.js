const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', ')
    });
  }

  // Erreur de duplication Mongoose
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Cette valeur existe déjà'
    });
  }

  // Erreur de cast Mongoose
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID invalide'
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }

  // Erreur d'expiration JWT
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré'
    });
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur'
  });
};

module.exports = errorHandler; 