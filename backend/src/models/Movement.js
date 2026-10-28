// backend/src/models/Movement.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movement = sequelize.define('Movement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('entry', 'exit'), // 'entry' = entrada/ingreso de stock, 'exit' = salida/venta
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING, // ej: 'Venta mostrador', 'Compra a distribuidor', 'Rotura'
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Movement;