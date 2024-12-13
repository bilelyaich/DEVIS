const { DataTypes } = require('sequelize');
const { sequelizeUserERP } = require('../db/config');

// Définir le modèle User sans les timestamps
const User = sequelizeUserERP.define('User', {
  codeuser: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  
    primaryKey: true,  
    validate: {
      notEmpty: true,  
    },
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50],  
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  
    validate: {
      isEmail: true,  
      notEmpty: true, 
    },
  },
  motpasse: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100], 
      notEmpty: true,  
    },
  },
}, {
  tableName: 'utilisateur',  
  timestamps: false, 
});

module.exports = User;
