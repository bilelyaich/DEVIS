const { DataTypes } = require("sequelize");

const defineArticleModel = (sequelize) => {
  return sequelize.define(
    "article",
    {
      famille: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      libelle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unite: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nbrunite: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    
      tauxtva: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      CONFIG: {
        type: DataTypes.STRING,
      },
      prix1: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0, 
      },
    },
    {
      tableName: "article",
      timestamps: false,
    }
  );
};

module.exports = defineArticleModel;
