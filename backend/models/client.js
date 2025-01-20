const { DataTypes } = require("sequelize");

const defineClientModel = (sequelize) => {
  return sequelize.define(
    "Client",
    {
      code: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      rsoc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "client",
      timestamps: false,
    }
  );
};

module.exports = defineClientModel;