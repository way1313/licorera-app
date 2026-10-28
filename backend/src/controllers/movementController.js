// backend/src/controllers/movementController.js
const { Movement, Product, sequelize } = require('../models');
const { Op } = require('sequelize'); // Importante para operadores de fecha

// Registrar entrada o salida
exports.createMovement = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { productId, type, quantity, reason } = req.body;
    const userId = req.user.id; // Obtenido del token autenticado

    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const qty = parseInt(quantity, 10);
    let unitPrice = 0;

    if (type === 'entry') {
      unitPrice = product.costPrice;
      product.stock += qty;
    } else if (type === 'exit') {
      if (product.stock < qty) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Stock insuficiente para realizar esta salida' });
      }
      unitPrice = product.price;
      product.stock -= qty;
    } else {
      await transaction.rollback();
      return res.status(400).json({ error: 'Tipo de movimiento inválido (use "entry" o "exit")' });
    }

    await product.save({ transaction });

    const movement = await Movement.create({
      productId,
      userId,
      type,
      quantity: qty,
      unitPrice,
      totalAmount: (qty * unitPrice).toFixed(2),
      reason
    }, { transaction });

    await transaction.commit();
    res.status(201).json({ message: 'Movimiento registrado con éxito', movement, currentStock: product.stock });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: 'Error al registrar el movimiento', details: error.message });
  }
};

// Resumen de métricas para el Dashboard
exports.getDashboardSummary = async (req, res) => {
  try {
    const { period } = req.query; // 'today', 'week', 'month', 'all'
    const whereMovements = {};

    const now = new Date();
    if (period === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      whereMovements.createdAt = { [Op.gte]: startOfDay };
    } else if (period === 'week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      whereMovements.createdAt = { [Op.gte]: sevenDaysAgo };
    } else if (period === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      whereMovements.createdAt = { [Op.gte]: startOfMonth };
    }

    const totalProducts = await Product.count();
    
    // Entradas según periodo
    const totalEntries = await Movement.sum('totalAmount', {
      where: { type: 'entry', ...whereMovements }
    }) || 0;
    
    // Salidas (Ventas) según periodo
    const totalExits = await Movement.sum('totalAmount', {
      where: { type: 'exit', ...whereMovements }
    }) || 0;

    // Productos con stock bajo
    const lowStock = await Product.findAll({
      where: sequelize.where(sequelize.col('stock'), '<=', sequelize.col('minStock'))
    });

    // Últimos movimientos del periodo seleccionado
    const recentMovements = await Movement.findAll({
      where: whereMovements,
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Product, as: 'product', attributes: ['name', 'category'] }
      ]
    });

    res.json({
      summary: {
        totalProducts,
        totalPurchasesCost: totalEntries,
        totalSalesRevenue: totalExits,
        lowStockAlerts: lowStock.length
      },
      lowStockProducts: lowStock,
      recentMovements
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar resumen del dashboard', details: error.message });
  }
};