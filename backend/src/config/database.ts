import { createConnection } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

export const initializeDatabase = async () => {
  try {
    const connection = await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'furniture_store',
      entities: [User, Product, Order, OrderItem],
      synchronize: process.env.NODE_ENV === 'development', // À désactiver en production
      logging: process.env.NODE_ENV === 'development',
    });

    console.log('Base de données connectée avec succès');
    return connection;
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    throw error;
  }
}; 