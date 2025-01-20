const { DataTypes } = require("sequelize");
const { sequelizeUserERP } = require("../db/config"); // Chemin correct vers config.js

const UserSoc = sequelizeUserERP.define(
  "usersoc",
  {
    CODEUSER: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    societe: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "usersoc",
    timestamps: false,
  }
);

module.exports = { UserSoc };
