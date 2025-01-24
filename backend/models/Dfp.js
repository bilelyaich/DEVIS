const { DataTypes } = require("sequelize");

const defineDfpModel = (sequelize) => {
  return sequelize.define(
    "dfp",
    {
      NUMBL: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      libpv: {
        type: DataTypes.STRING,
       
      },


      ADRCLI: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CODECLI: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DATEBL: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      MREMISE: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      MTTC: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      MTVA: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      RSCLI: {
        type: DataTypes.STRING,
      },
      MHT: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      comm: {
        type: DataTypes.STRING,
      },
      CODEREP: {
        type: DataTypes.STRING, 
        allowNull: true,
      },
      RSREP: {
        type: DataTypes.STRING, 
        allowNull: true,
      },

      mlettre: {
        type: DataTypes.STRING,
        allowNull: true,       
      },
    },
    {
      tableName: "dfp",
      timestamps: false,
    },

 
  );
};

module.exports = defineDfpModel;
