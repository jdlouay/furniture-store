const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const [existingUsers] = await global.db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer un nouvel utilisateur
    const [result] = await global.db.promise().query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    if (result.affectedRows === 1) {
      // Récupérer les données de l'utilisateur
      const [newUser] = await global.db.promise().query(
        'SELECT id, username, email, role FROM users WHERE id = ?',
        [result.insertId]
      );

      // Générer le token
      const token = generateToken(result.insertId);

      res.status(201).json({
        success: true,
        token,
        user: newUser[0]
      });
    } else {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const [users] = await global.db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    const user = users[0];

    // Vérifier si le mot de passe correspond
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token
    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const [users] = await global.db.promise().query(
      'SELECT id, username, email, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Déconnexion / effacement du cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Création d'un compte administrateur
// @route   POST /api/auth/register-admin
// @access  Public
exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const [existingUsers] = await global.db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer un nouvel utilisateur admin
    const [result] = await global.db.promise().query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'admin']
    );

    if (result.affectedRows === 1) {
      // Récupérer les données de l'utilisateur
      const [newUser] = await global.db.promise().query(
        'SELECT id, username, email, role FROM users WHERE id = ?',
        [result.insertId]
      );

      // Générer le token
      const token = generateToken(result.insertId);

      res.status(201).json({
        success: true,
        token,
        user: newUser[0]
      });
    } else {
      throw new Error("Erreur lors de la création de l'administrateur");
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 