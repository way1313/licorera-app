const { Sequelize } = require('sequelize');
require('dotenv').config();


let sequelize;

if (process.env.DATABASE_URL) {
  // Conexión para producción (Supabase / Render)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Necesario para evitar rechazos de certificados en la nube
      },
    },
  });
} else {
  // Conexión para tu entorno local
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );
}

module.exports = sequelize;