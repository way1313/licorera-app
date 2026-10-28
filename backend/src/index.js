require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('./models'); // Inicializa relaciones de modelos

// Rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const movementRoutes = require('./routes/movementRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Endpoints principales
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/movements', movementRoutes);

// Ruta de prueba
app.get('/api/status', (req, res) => {
  res.json({ status: 'Servidor operativo', message: 'API de Licorera lista' });
});

// Conexión y sincronización con PostgreSQL
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Conexión a PostgreSQL establecida con éxito.');

    // sync() creará las tablas automáticamente si no existen en licorera_db
    await sequelize.sync({ alter: true });
    console.log(' Modelos sincronizados correctamente con la base de datos.');

    app.listen(PORT, () => {
      console.log(` Servidor ejecutándose en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error(' Error al conectar con la base de datos:', error);
  }
};
startServer();