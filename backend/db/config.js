const { Sequelize } = require('sequelize');

const sequelizeLC24  = new Sequelize('LC24', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
  port: 3306,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});


const sequelizeUserERP = new Sequelize('usererp', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql', 
  port: 3306,    
  logging: false,   
  pool: {
    max: 5,
    min: 0,                                                                   
    acquire: 30000,
    idle: 10000,
  },            
});                    

 
(async () => {   
  try {   
    await sequelizeLC24 .authenticate();
    console.log('Connexion réussie à la base de données LC24.');   
    await sequelizeUserERP.authenticate();
    console.log('Connexion réussie à la base de données usererp.');
  } catch (error) {                  
    console.error('Erreur lors de la connexion à l\'une des bases de données :', error);
  }
})();                                


module.exports ={ sequelizeLC24, sequelizeUserERP};                                             