const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Subscription = sequelize.define(
  "Subscription",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    maximum_member: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phoneNumber: {
      type: DataTypes.STRING,
    },

    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },


  },
  {
    timestamps: true,
  },
);

Subscription.associate = function (models) {
  Subscription.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};

module.exports = Subscription;
