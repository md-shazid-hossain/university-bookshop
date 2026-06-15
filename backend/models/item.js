// Item model (add this to item.js)
const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Item = sequelize.define(
  "Item",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    contactOption: {
      type: DataTypes.ENUM("chat-only", "show-phone"),
      allowNull: false,
      defaultValue: "chat-only",
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

// Define association
Item.associate = function (models) {
  Item.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};

module.exports = Item;
