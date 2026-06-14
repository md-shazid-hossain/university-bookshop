const sequelize = require('../config/db');

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ DB connection failed:', error);
  }
};

module.exports = { sequelize, connectDB };