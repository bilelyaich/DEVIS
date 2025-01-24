const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Representant = require('../models/representant');
const User = require ('../models/User')
const { sequelizeUserERP } = require('../db/config');
const { Sequelize } = require('sequelize');



const registerUser = async (req, res) => {
  const { email, motpasse, nom, codeuser } = req.body;  

  try {
  
    if (!email || !motpasse || !nom || !codeuser) {
      return res.status(400).json({ message: 'Tous les champs doivent être remplis.' });
    }

  
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

  
    const hashedPassword = await bcrypt.hash(motpasse, 10);

   
    const newUser = await User.create({
      codeuser,         
      email,
      motpasse: hashedPassword,
      nom,
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      user: {
        codeuser: newUser.codeuser, 
        email: newUser.email,
        nom: newUser.nom,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error.message || error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'utilisateur.', error: error.message });
  }
};


const loginUser = async (req, res) => {
  const { nom, motpasse } = req.body;

  try {
    // Vérification que tous les champs sont remplis
    if (!nom || !motpasse) {
      return res.status(400).json({ message: 'Tous les champs doivent être remplis.' });
    }

  
    const user = await User.findOne({ where: { nom } });
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    
    if (user.motpasse !== motpasse) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

  
    const societies = await sequelizeUserERP.query(
      `SELECT us.societe FROM usersoc us WHERE us.codeuser = :codeuser`,
      {
        replacements: { codeuser: user.codeuser },
        type: sequelizeUserERP.QueryTypes.SELECT,
      }
    );

 
    const token = jwt.sign(
      { codeuser: user.codeuser },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

  
    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        codeuser: user.codeuser,
        nom: user.nom,
        email: user.email,
      },
      societies: societies.map(s => s.societe),
    });
  } catch (error) {
    console.error('Erreur lors de la connexion de l\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
  }
};


const selectDatabase = async (req, res) => {
  const { databaseName } = req.body;

 
  if (!databaseName) {
    return res.status(400).json({ message: 'Le nom de la base de données est requis.' });
  }

  try {
   
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'En-tête Authorization manquant.' });
    }

    
    const decoded = jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET_KEY);
    const codeuser = decoded.codeuser; 

   
    const dbConnection = new Sequelize(`mysql://root:@127.0.0.1:3306/${databaseName}`, {
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

   
    await dbConnection.authenticate();

  
    const devisList = await dbConnection.query(
      `SELECT YEAR(datebl) AS year, MAX(numbl) AS numbl
       FROM dfp
       WHERE usera = :codeuser
       GROUP BY YEAR(datebl)
       ORDER BY year DESC`,
      {
        replacements: { codeuser },
        type: dbConnection.QueryTypes.SELECT,
      }
    );


    if (devisList.length === 0) {
      return res.status(404).json({ message: 'Aucun devis trouvé pour cet utilisateur.' });
    }

  
    res.status(200).json({
      message: `Connecté à la base ${databaseName}`,
      databaseName,
      devis: devisList, 
    });
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données :', error);
    res.status(500).json({ message: 'Impossible de se connecter à la base de données.' });
  }
};



const getDevisDetails = async (req, res) => {
  const { databaseName, NUMBL } = req.params; 

  if (!databaseName || !NUMBL) {
    return res.status(400).json({ message: 'Le nom de la base de données et le numéro de devis sont requis.' });
  }

  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'En-tête Authorization manquant.' });
    }
 
    const decoded = jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET_KEY);
    const codeuser = decoded.codeuser; 
    const dbConnection = new Sequelize(`mysql://root:@127.0.0.1:3306/${databaseName}`, {
      dialect: 'mysql',
      logging: false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    });

    await dbConnection.authenticate();

  
    const [devisDetails, ldfpDetails] = await Promise.all([
      dbConnection.query(
        `SELECT dfp.NUMBL, dfp.ADRCLI, dfp.CODECLI, dfp.cp , dfp.MTTC, dfp.MHT, dfp.CODEREP, dfp.RSREP ,dfp.comm ,dfp.RSCLI, dfp.usera, dfp.DATEBL
         FROM dfp
         WHERE dfp.NUMBL = :NUMBL AND dfp.usera = :codeuser`,
        {
          replacements: { NUMBL, codeuser },
          type: dbConnection.QueryTypes.SELECT,
        }
      ),
      dbConnection.query(
        `SELECT ldfp.CodeART, ldfp.DesART, ldfp.QteART, ldfp.Remise, ldfp.TauxTVA, ldfp.Unite, ldfp.Conf, ldfp.NLigne, ldfp.famille, ldfp.PUART
         FROM ldfp
         WHERE ldfp.NUMBL = :NUMBL`,
        {
          replacements: { NUMBL },
          type: dbConnection.QueryTypes.SELECT,
        }
      ),
    ]);

    if (devisDetails.length === 0) {
      return res.status(404).json({ message: 'Aucun devis trouvé pour ce numéro de devis.' });
    }

   
    res.status(200).json({
      message: `Informations du devis ${NUMBL} récupérées avec succès.`,
      databaseName,
      devis: [
        {
          year: new Date(devisDetails[0].DATEBL).getFullYear(),
          numbl: devisDetails[0].NUMBL,
          dfpDetails: devisDetails[0],
          lignes: ldfpDetails.map((article) => ({
            CodeART: article.CodeART,
            DesART: article.DesART,
            QteART: article.QteART,
            Remise: article.Remise,
            TauxTVA: article.TauxTVA,
            Unite: article.Unite,
            Conf: article.Conf,
            NLigne: article.NLigne,
            famille: article.famille,
            PUART: article.PUART,


          })),
        },
      ],
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du devis :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des détails du devis.' });
  }
};


const getLatestDevisByYear = async (req, res) => {
  const { databaseName } = req.params;

  if (!databaseName) {
    return res
      .status(400)
      .json({ message: 'Le nom de la base de données est requis.' });
  }

  try {
  
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'En-tête Authorization manquant.' });
    }

    const decoded = jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET_KEY);
    const codeuser = decoded.codeuser;

   
    const dbConnection = new Sequelize(`mysql://root:@127.0.0.1:3306/${databaseName}`, {
      dialect: 'mysql',
      logging: false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    });

    await dbConnection.authenticate();

   
    const latestDevis = await dbConnection.query(
      `SELECT 
         YEAR(DATEBL) AS year, 
         MAX(numbl) AS numbl 
       FROM dfp 
       WHERE usera = :codeuser
       GROUP BY YEAR(DATEBL)`,
      {
        replacements: { codeuser },
        type: dbConnection.QueryTypes.SELECT,
      }
    );

    if (latestDevis.length === 0) {
      return res.status(404).json({ message: 'Aucun devis trouvé pour cet utilisateur.' });
    }

 
    const devisDetails = await Promise.all(
      latestDevis.map(async ({ year, numbl }) => {
        const dfpDetails = await dbConnection.query(
          `SELECT dfp.numbl, dfp.adrcli, dfp.codecli, dfp.cp, dfp.RSCLI, dfp.usera, dfp.DATEBL
           FROM dfp 
           WHERE numbl = :numbl`,
          {
            replacements: { numbl },
            type: dbConnection.QueryTypes.SELECT,
          }
        );

        const ldfpDetails = await dbConnection.query(
          `SELECT ldfp.CodeART, ldfp.DesART, ldfp.QteART, ldfp.Remise, ldfp.TauxTVA, ldfp.Unite
           FROM ldfp 
           WHERE NumBL = :numbl`,
          {
            replacements: { numbl },
            type: dbConnection.QueryTypes.SELECT,
          }
        );

        return {
          year,
          numbl,
          dfpDetails: dfpDetails[0],
          articles: ldfpDetails,
        };
      })
    );

  
    res.status(200).json({
      message: 'Derniers devis par année récupérés avec succès.',
      databaseName,
      devis: devisDetails,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des devis par année :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des devis.' });
  }
};





const getAllClients = async (req, res) => {
  const { databaseName } = req.params;

  if (!databaseName) {
    return res
      .status(400)
      .json({ message: 'Le nom de la base de données est requis.' });
  }

  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'En-tête Authorization manquant.' });
    }

    const decoded = jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET_KEY);
    const codeuser = decoded.codeuser;

    const dbConnection = new Sequelize(`mysql://root:@127.0.0.1:3306/${databaseName}`, {
      dialect: 'mysql',
      logging: false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    });

    await dbConnection.authenticate();

    // Récupérer tous les clients
    const clients = await dbConnection.query(
      `SELECT 
         ADRCLI, 
         CODECLI, 
         CODEFACTURE, 
         CP, 
         RSCLI, 
         comm
       FROM dfp
       WHERE usera = :codeuser`,
      {
        replacements: { codeuser },
        type: dbConnection.QueryTypes.SELECT,
      }
    );

    if (clients.length === 0) {
      return res.status(404).json({ message: 'Aucun client trouvé pour cet utilisateur.' });
    }

    res.status(200).json({
      message: 'Liste des clients récupérée avec succès.',
      databaseName,
      clients,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des clients :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des clients.' });
  }
};

module.exports = { 
  registerUser,
  loginUser,
  selectDatabase,
  getDevisDetails,
  getLatestDevisByYear,
  getAllClients, 
};
