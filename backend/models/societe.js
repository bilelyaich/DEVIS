

const { DataTypes } = require("sequelize");
const { sequelizeUserERP } = require("../db/config");

const Societe = sequelizeUserERP.define('societe', {
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'societe',
    timestamps: false,
  });   


  module.exports = {  Societe };