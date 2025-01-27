
const { Sequelize } = require("sequelize");
require('dotenv').config();  

const defaultDbConfig = {
  username: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};


const getSequelizeConnection = (dbName = "") => {
  
  const passwordPart = process.env.DB_PASSWORD ? `:${process.env.DB_PASSWORD}` : "";

  const connectionString = dbName 
    ? `mysql://${process.env.DB_USER}${passwordPart}@${process.env.DB_HOST}:${process.env.DB_PORT}/${dbName}`
    : `mysql://${process.env.DB_USER}${passwordPart}@${process.env.DB_HOST}:${process.env.DB_PORT}`;

  

  return new Sequelize(connectionString, { ...defaultDbConfig, database: dbName || undefined });
};



const sequelize = getSequelizeConnection();  


const sequelizeUserERP = getSequelizeConnection("usererp");


const testConnections = async () => {
  try { 
    await sequelize.authenticate();
    console.log("Connexion réussie à la base de données principale.");
    
   
    await sequelizeUserERP.authenticate();
    console.log("Connexion réussie à la base de données usererp.");
  } catch (error) {
    console.error("Erreur lors de la connexion à l'une des bases de données :", error.message);
  }
};


testConnections();


const getDatabases = async () => {
  try {
    const result = await sequelize.query("SHOW DATABASES;", {
      type: Sequelize.QueryTypes.SELECT,
    });
    const databases = result.map((db) => db.Database);

    if (databases.length === 0) {
      throw new Error("Aucune base de données disponible.");
    }

    return databases;
  } catch (error) {
    console.error("Erreur lors de la récupération des bases de données :", error.message);
    return [];
  }
};


const connectToAllDatabases = async () => {
  const databases = await getDatabases();

  if (databases.length === 0) {
    console.log("Aucune base de données disponible.");
    return; 
  }

  for (const dbName of databases) {
    try {
      const dbConnection = getSequelizeConnection(dbName);
      await dbConnection.authenticate();
     
      await dbConnection.close();
    } catch (error) {
      console.error(`Erreur lors de la connexion à la base de données ${dbName} :`, error.message);
    }
  }
};


connectToAllDatabases();


module.exports = {
  sequelize,
  sequelizeUserERP,
  getSequelizeConnection
};
