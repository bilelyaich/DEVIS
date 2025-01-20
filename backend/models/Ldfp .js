
const { DataTypes } = require("sequelize");
const defineLdfpModel = (sequelize) => {
    return sequelize.define(
      "ldfp",
      {
        NUMBL: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        CodeART: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        DesART: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        QteART: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        PUART: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        Remise: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        TauxTVA: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        Unite: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        Conf: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        famille: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        nbun: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },   
      {
        tableName: "ldfp",
        timestamps: false,
      }
    );
  };
  module.exports = defineLdfpModel;
