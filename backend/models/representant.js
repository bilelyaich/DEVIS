const { DataTypes } = require('sequelize');
const {sequelizeLC24} = require('../db/config');


const Representant = sequelizeLC24.define('Representant', {
    Code: {
    type: DataTypes.STRING, 
    primaryKey: true,       
    allowNull: false,       
  },
}, {
  tableName: 'representant',   
  timestamps: false,          
});

module.exports = Representant;
