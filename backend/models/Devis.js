const { DataTypes } = require("sequelize");

const defineDevisModel = (sequelize) => {
  return sequelize.define(
    "Devis",  
    {
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
    },
    {
      tableName: 'dfp',
      timestamps: false,  
    }
  );
};

module.exports = defineDevisModel;
    