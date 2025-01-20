const { DataTypes } = require('sequelize');
const {sequelize} = require('../db/config');


const Representant = sequelize.define('Representant', {
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
