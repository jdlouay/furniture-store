const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé à accéder à cette route'
      });
    }

    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // Récupérer l'utilisateur
      const [users] = await global.db.promise().query(
        'SELECT id, username, email, role FROM users WHERE id = ?',
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      req.user = users[0];
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé à accéder à cette route'
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette route`
      });
    }
    next();
  };
}; 