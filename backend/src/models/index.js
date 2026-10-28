// backend/src/models/index.js
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Movement = require('./Movement');

// Relaciones:
// Un Producto puede tener muchos Movimientos
Product.hasMany(Movement, { foreignKey: 'productId', as: 'movements' });
Movement.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Un Usuario (admin/empleado) registra muchos Movimientos
User.hasMany(Movement, { foreignKey: 'userId', as: 'movements' });
Movement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Product,
  Movement,
};