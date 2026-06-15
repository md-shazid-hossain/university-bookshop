// After defining both models, add the associations

// User model (add this to user.js)
const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
  },
});

// Define association
User.associate = function(models) {
  User.hasMany(models.Item, {
    foreignKey: 'userId',
    as: 'items' // alias for easy access
  });
};

module.exports = User;