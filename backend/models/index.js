const sequelize = require('../config/db');

const connectDB = async () => {
  // Try catch formula switch
  try {
    await sequelize.authenticate();
    //showing result succesfull if connection secure.
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    //showing result db connection failed if error.
    console.error('❌ DB connection failed:', error);
  }
};

module.exports = { sequelize, connectDB };
// complete index part.
//checking every part is up to date.