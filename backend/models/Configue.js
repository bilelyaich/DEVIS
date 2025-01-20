const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/config");

const Configue = sequelize.define('Configue', {
    CodeART: {
      type: DataTypes.STRING,
    },
    Conf: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'ldfp',
    timestamps: false,
  });
  

module.exports = Configue;
