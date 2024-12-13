const { Sequelize, DataTypes } = require("sequelize");
const { sequelizeLC24 } = require("../db/config");

const Article = sequelizeLC24.define(
  "Article",
  {
    famille: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
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
    puht: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    remise: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    tauxtva: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    puttc: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    netht: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "article",
    timestamps: false,
  }
);

module.exports = Article;
