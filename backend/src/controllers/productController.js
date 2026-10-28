// backend/src/controllers/productController.js
const { Product } = require('../models');

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar productos', details: error.message });
  }
};

// Crear nuevo producto
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, costPrice, stock, minStock, imageUrl } = req.body;
    const product = await Product.create({
      name,
      category,
      price,
      costPrice,
      stock: stock || 0,
      minStock: minStock || 5,
      imageUrl
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto', details: error.message });
  }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Product.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    
    const productUpdated = await Product.findByPk(id);
    res.json(productUpdated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto', details: error.message });
  }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto', details: error.message });
  }
};