# Backend de l'Application de Vente de Meubles

Ce projet est le backend d'une application de vente de meubles développée avec Node.js, Express et MongoDB.

## Configuration requise

- Node.js (v14 ou supérieur)
- MongoDB
- npm ou yarn

## Installation

1. Cloner le repository
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Créer un fichier `.env` à la racine du projet avec les variables suivantes :
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/furniture-store
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=24h
   CORS_ORIGIN=http://localhost:4200
   ```

## Scripts disponibles

- `npm start` : Démarre le serveur en mode production
- `npm run dev` : Démarre le serveur en mode développement avec nodemon
- `npm run seed` : Initialise la base de données avec des données de test
- `npm test` : Lance les tests

## Structure du projet

```
src/
├── controllers/     # Contrôleurs de l'application
├── middleware/      # Middleware personnalisés
├── models/         # Modèles Mongoose
├── routes/         # Routes de l'API
├── utils/          # Utilitaires
└── server.js       # Point d'entrée de l'application
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Inscription d'un utilisateur
- POST `/api/auth/login` - Connexion d'un utilisateur
- GET `/api/auth/me` - Obtenir le profil de l'utilisateur connecté
- GET `/api/auth/logout` - Déconnexion

### Meubles

- GET `/api/furniture` - Liste des meubles
- GET `/api/furniture/:id` - Détails d'un meuble
- POST `/api/furniture` - Créer un meuble (Admin)
- PUT `/api/furniture/:id` - Modifier un meuble (Admin)
- DELETE `/api/furniture/:id` - Supprimer un meuble (Admin)

### Panier

- GET `/api/cart` - Obtenir le panier de l'utilisateur
- POST `/api/cart` - Ajouter un article au panier
- PUT `/api/cart/:itemId` - Modifier la quantité d'un article
- DELETE `/api/cart/:itemId` - Supprimer un article du panier
- DELETE `/api/cart` - Vider le panier

### Commandes

- POST `/api/orders` - Créer une commande
- GET `/api/orders` - Liste des commandes (Admin)
- GET `/api/orders/me` - Commandes de l'utilisateur
- GET `/api/orders/:id` - Détails d'une commande
- PUT `/api/orders/:id/pay` - Mettre à jour le statut de paiement
- PUT `/api/orders/:id/deliver` - Mettre à jour le statut de livraison (Admin)
- PUT `/api/orders/:id/cancel` - Annuler une commande

## Modèles de données

### User
```javascript
{
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  role: String (enum: ['user', 'admin'])
}
```

### Furniture
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String,
  stock: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  material: String,
  color: String
}
```

### Cart
```javascript
{
  user: ObjectId,
  items: [{
    furniture: ObjectId,
    quantity: Number
  }]
}
```

### Order
```javascript
{
  user: ObjectId,
  items: [{
    furniture: ObjectId,
    quantity: Number,
    price: Number
  }],
  shippingAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentMethod: String,
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  totalPrice: Number,
  status: String,
  isPaid: Boolean,
  paidAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date
}
```

## Sécurité

- Authentification basée sur JWT
- Protection des routes sensibles
- Hachage des mots de passe avec bcrypt
- Validation des données
- Gestion des CORS

## Tests

Les tests sont écrits avec Jest et Supertest. Pour lancer les tests :

```bash
npm test
```

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request 