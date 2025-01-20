const { DataTypes } = require("sequelize");

const defineLdfpModel = (sequelize) => {
  return sequelize.define('Ldfp', {
  CodeART: { 
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true, 
  },
  Conf: {  
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'ldfp',
  timestamps: false,
}
);
};

module.exports = defineLdfpModel;
