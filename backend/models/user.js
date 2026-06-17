const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.associate = function (models) {
  User.hasMany(models.Item, {
    foreignKey: "userId",
    as: "items",
  });

  User.hasMany(models.Subscription, {
    foreignKey: "userId",
    as: "subscriptions",
  });
};

module.exports = User;
//completed the user part.

//checdking everything is up to date.