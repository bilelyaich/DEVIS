const { DataTypes } = require('sequelize');
const {sequelizeLC24} = require('../db/config');


const Devis = sequelizeLC24.define('Devis', {
  NUMBL: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'NUMBL', 
  },
  libpv: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'libpv',  
  },
}, {
  tableName: 'dfp', 
  timestamps: false, 
});

module.exports = Devis;
