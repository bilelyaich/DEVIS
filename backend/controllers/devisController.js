const { Sequelize,QueryTypes  } = require("sequelize");
const defineClientModel = require("../models/client");
const defineDevisModel= require("../models/Devis");
const { getSequelizeConnection } = require("../db/config");

const jwt = require('jsonwebtoken');
const defineArticleModel = require("../models/article");



const defineDfpModel = require('../models/Dfp');

const defineLdfpModel = require('../models/Ldfp ');



const getAllClients = async (req, res) => {
  const { dbName } = req.params; 

  if (!dbName) {
    return res.status(400).json({
      message: "Le nom de la base de données est requis.",
    });
  }

  try {
   
    const dynamicSequelize = getSequelizeConnection(dbName);
     await dynamicSequelize.authenticate();

    console.log(`Connecté à la base de données : ${dbName}`);

  
    const Client = defineClientModel(dynamicSequelize);

   
    const clients = await Client.findAll({
      attributes: ["code", "rsoc"], 
    });

    if (clients.length === 0) {
      return res.status(404).json({
        message: "Aucun client trouvé dans cette base de données.",
      });
    }

    return res.status(200).json({
      message: "Clients récupérés avec succès.",
      clients,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des clients :", error.message);
    return res.status(500).json({
      message: "Erreur lors de la récupération des clients.",
      error: error.message,
    });
  }
};

const getClientByCode = async (req, res) => {
  const { dbName, code } = req.params; 

  if (!dbName || !code) {
    return res.status(400).json({
      message: "Le nom de la base de données et le code du client sont requis.",
    });
  }

  try {
    
   const dynamicSequelize = getSequelizeConnection(dbName);
   

   
    await dynamicSequelize.authenticate();
    console.log(`Connecté à la base de données : ${dbName}`);

    
    const Client = defineClientModel(dynamicSequelize);

    
    const client = await Client.findOne({
      where: { code: code },
      attributes: ["code", "rsoc", "adresse", "cp", "email", "tel1"],
    });

    if (!client) {
      return res.status(404).json({
        message: "Client non trouvé",
      });
    }

    return res.status(200).json({
      message: "Détails du client récupérés avec succès",
      client,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du client :", error.message);
    return res.status(500).json({
      message: "Erreur lors de la récupération des détails du client",
      error: error.message,
    });
  }
};

const getClientByRsoc = async (req, res) => {
  const { dbName, rsoc } = req.params;

  if (!dbName || !rsoc) {
    return res.status(400).json({
      message: "Le nom de la base de données et la raison sociale sont requis.",
    });
  }

  try {
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();
    console.log(`Connecté à la base de données : ${dbName}`);

    const Client = defineClientModel(dynamicSequelize);

    const client = await Client.findOne({
      where: { rsoc: rsoc },
      attributes: ["code", "rsoc", "adresse", "cp", "email", "tel1"],
    });

    if (!client) {
      return res.status(404).json({
        message: "Client non trouvé",
      });
    }

    return res.status(200).json({
      message: "Détails du client récupérés avec succès",
      client,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du client :", error.message);
    return res.status(500).json({
      message: "Erreur lors de la récupération du client",
      error: error.message,
    });
  }
};

const getAllDevis = async (req, res) => {
  const { dbName } = req.params; 

  if (!dbName) {
    return res.status(400).json({
      message: "Le nom de la base de données est requis.",
    });
  }

  try {
   
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();
    console.log(`Connecté à la base de données : ${dbName}`);

   
    const result = await dynamicSequelize.query(
      `SELECT NUMBL, libpv FROM dfp`,
      { type: QueryTypes.SELECT }
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "Aucun devis trouvé.",
      });
    }

    return res.status(200).json({
      message: "Devis trouvés avec succès",
      devisList: result,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des devis :", error.message);
    return res.status(500).json({
      message: "Erreur lors de la récupération des devis.",
      error: error.message,
    });
  }
};


const getLibpvByNumbl = async (req, res) => {
  const { dbName, numbl } = req.params;

  if (!dbName || !numbl) {
    return res.status(400).json({
      message: "Le nom de la base de données et le NUMBL sont requis.",
    });
  }

  try {
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();
    console.log(`Connecté à la base de données : ${dbName}`);

    const result = await dynamicSequelize.query(
      `SELECT libpv FROM dfp WHERE NUMBL = :numbl`,
      {
        replacements: { numbl },
        type: QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: `Aucun devis trouvé avec le NUMBL : ${numbl}`,
      });
    }

    return res.status(200).json({
      message: "libpv récupéré avec succès",
      libpv: result[0].libpv,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du libpv :", error.message);
    return res.status(500).json({
      message: "Erreur lors de la récupération du libpv.",
      error: error.message,
    });
  }
};


const formatDevisData = (result) => {
  const formattedDevis = result.reduce((acc, item) => {
    const numbl = item.NUMBL;
    if (!numbl) return acc;
    if (!acc[numbl]) {
      acc[numbl] = {
        NUMBL: numbl,
        client: {
          ADRCLI: item["client.ADRCLI"] || null,
          libpv: item["client.libpv"] || null,
          CODECLI: item["client.CODECLI"] || null,
          DATEBL: item["client.DATEBL"] || null,
          CP: item["client.CP"] || null,
          RSCLI: item["client.RSCLI"] || null,
          MTTC: item["client.MTTC"] || null,
        },
        articles: [],
      };
    }

    if (item["articles.CodeART"]) {
      acc[numbl].articles.push({
        famille: item["articles.famille"],
        CodeART: item["articles.CodeART"],
        DesART: item["articles.DesART"] || null,
        QteART: item["articles.QteART"] || 0,
        Remise: item["articles.Remise"] || 0,
        TauxTVA: item["articles.TauxTVA"] || 0,
      });
    }

    return acc;
  }, {});

  return Object.values(formattedDevis);
};


const getDevisWithDetails = async (req, res) => {
  const dbName = req.params.dbName;

  if (!dbName) {
    return res.status(400).json({
      message: "Le nom de la base de données est requis.",
    });
  }

  try {
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();
    console.log(`Connecté à la base de données : ${dbName}`);

    const result = await dynamicSequelize.query(
      `
      SELECT 
        Devis.NUMBL, 
        Devis.libpv AS "client.libpv", 
        Devis.ADRCLI AS "client.ADRCLI", 
        Devis.CODECLI AS "client.CODECLI", 
        Devis.CP AS "client.CP", 
        Devis.RSCLI AS "client.RSCLI", 
        Devis.MTTC AS "client.MTTC",
         Devis.DATEBL AS "client.DATEBL",

         articles.famille AS "articles.famille", 
        articles.CodeART AS "articles.CodeART", 
        articles.DesART AS "articles.DesART", 
        articles.QteART AS "articles.QteART", 
        articles.Remise AS "articles.Remise", 
        articles.TauxTVA AS "articles.TauxTVA"
      FROM dfp AS Devis
      LEFT JOIN ldfp AS articles ON Devis.NUMBL = articles.NUMBL
      `,
      { type: QueryTypes.SELECT }
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "Aucun devis trouvé.",
      });
    }

    const formattedDevis = formatDevisData(result);

    res.status(200).json(formattedDevis);
  } catch (error) {
    console.error("Erreur lors de la récupération des devis :", error.message);
    res.status(500).json({
      message: "Erreur lors de la récupération des devis.",
      error: error.message,
    });
  }
};



const getTotalDevis = async (req, res) => {
  const { dbName } = req.params;

  if (!dbName) {
    return res.status(400).json({
      message: "Le nom de la base de données est requis.",
    });
  }

  try {
    const dynamicSequelize = getSequelizeConnection(dbName);
    const Devis = defineDevisModel(dynamicSequelize);

  
    const devisCount = await Devis.count({
      distinct: true,
      col: "NUMBL"
    });

    console.log("Total des devis (distinct NUMBL) avec Sequelize : ", devisCount);

    return res.status(200).json({
      message: "Total des devis récupéré avec succès.",
      totalDevis: devisCount,
    });

  } catch (error) {
    console.error("Erreur lors de la récupération du total des devis :", error.message);
    return res.status(500).json({
      message: "Erreur lors de la récupération du total des devis.",
      error: error.message,
    });
  }
};

const getDevisCountByMonthAndYear = async (req, res) => {
  const { dbName } = req.params;

  if (!dbName) {
    return res.status(400).json({
      message: "Le nom de la base de données est requis.",
    });
  }

  try {
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();
    console.log(`Connecté à la base de données : ${dbName}`);

    
    const sqlQuery = `
      SELECT 
        YEAR(DATEBL) AS year,
        MONTH(DATEBL) AS month,
        COUNT(DISTINCT NUMBL) AS totalDevis
      FROM dfp
      GROUP BY YEAR(DATEBL), MONTH(DATEBL)
      ORDER BY year DESC, month DESC;
    `;
    console.log("Exécution de la requête SQL : ", sqlQuery);

    const result = await dynamicSequelize.query(sqlQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (result.length === 0) {
      return res.status(404).json({
        message: "Aucun devis trouvé.",
      });
    }

    console.log("Résultats de la requête (devis par mois et année) :", result);

    return res.status(200).json({
      message: "Nombre de devis par mois et année récupéré avec succès.",
      devisCountByMonthAndYear: result,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre de devis par mois et année :", error.message);
    return res.status(500).json({
      message: "Erreur lors de la récupération du nombre de devis par mois et année.",
      error: error.message,
    });
  }
};


const getDevisValidees = async (req, res) => {
  const { dbName } = req.params; 

  if (!dbName) {
    return res.status(400).json({
      message: "Le nom de la base de données est requis.",
    });
  }

  try {
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();
    console.log(`Connecté à la base de données : ${dbName}`);

  
    const result = await dynamicSequelize.query(
      `SELECT NumBL, DateBL, PFvalide, cloturer FROM dfp WHERE PFvalide = 1`, 
      { type: QueryTypes.SELECT }
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "Aucun devis validé trouvé.",
      });
    }

    return res.status(200).json({
      message: "Devis validés trouvés avec succès",
      devisValidees: result,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des devis validés :", error.message);
    return res.status(500).json({
      message: "Erreur lors de la récupération des devis validés.",
      error: error.message,
    });
  }
};

const createDevis = async (req, res) => {
  const { dbName } = req.params;
  const {
    NUMBL,
    libpv,
    adresse,
    code,
    cp,
    DATEBL,
    MREMISE,
    MTTC,
    comm,
    RSREP,
    CODEREP,
    usera,
    rsoc,
    codesecteur,
    MHT,
    articles,
  } = req.body;

  console.log("NUMBL reçu:", NUMBL); 
  console.log("Code client reçu:", code);  
  console.log("Articles reçus :", articles);

  if (!NUMBL || NUMBL.trim() === "") {
    return res.status(400).json({ message: "Le champ NUMBL est manquant." });
  }
  if (!code || code.trim() === "") {
    return res.status(400).json({ message: "Le code client est manquant." });
  }
  if (!adresse || adresse.trim() === "") {
    return res.status(400).json({ message: "L'adresse du client est manquante ou vide." });
  }
  if (!Array.isArray(articles)) {
    return res.status(400).json({ message: "Le champ 'articles' doit être un tableau." });
  }

  try {
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();

    const Dfp = defineDfpModel(dynamicSequelize);
    const Ldfp = defineLdfpModel(dynamicSequelize);
    const Client = defineClientModel(dynamicSequelize);

    // Vérification de l'existence du devis
    const existingDevis = await Dfp.findOne({ where: { NUMBL } });
    if (existingDevis) {
      return res.status(400).json({
        message: `Le devis avec le numéro ${NUMBL} existe déjà.`,
      });
    }

    // Récupération des données du client
    const client = await Client.findOne({ where: { code } });
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    console.log("Données du client récupérées :", client);

    const clientAdresse = client.adresse && client.adresse.trim() !== "" ? client.adresse : adresse;

    if (!clientAdresse || clientAdresse.trim() === "") {
      return res.status(400).json({
        message: "L'adresse du client est manquante ou vide même après vérification.",
      });
    }

    const transaction = await dynamicSequelize.transaction();

    // Génération automatique de la chaîne "Devis En Cours -- crée le : ..."
    const creationDate = new Date();
    const formattedDate = creationDate.toISOString().split("T")[0]; // Format AAAA-MM-JJ
    const mlettre = `Devis En Cours -- crée le : ${formattedDate} / par : ${usera || "N/A"}`;

    // Préparation des données pour le devis
    const dfpData = {
      NUMBL,
      libpv,
      ADRCLI: clientAdresse,
      CODECLI: client.code,
      DATEBL,
      MREMISE,
      MTTC,
      RSREP,
      CODEREP,
      MHT,
      codesecteur,
      CP: client.cp, // Ajout explicite du champ CP
      comm,
      RSCLI: client.rsoc,
      MLETTRE: mlettre, // Stockage de la chaîne dans le champ MLETTRE
    };
    

    // Création du devis dans la table "dfp"
    const devis = await Dfp.create(dfpData, { transaction });

    const insertedArticles = [];

    // Ajout des articles associés au devis
    for (const article of articles) {
      if (!article.code || !article.libelle || !article.nbrunite || !article.prix1 || !article.tauxtva) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Tous les champs nécessaires pour l'article doivent être fournis.",
        });
      }

      const articleData = {
        NUMBL,
        CodeART: article.code,
        DesART: article.libelle,
        QteART: article.nbrunite,
        PUART: article.prix1,
        Remise: article.Remise,
        TauxTVA: article.tauxtva,
        Unite: article.unite || "unité",
        Conf: article.CONFIG || "",
        famille: article.famille || "",
        nbun: article.nbrunite,
      };

      const insertedArticle = await Ldfp.create(articleData, { transaction });
      insertedArticles.push(insertedArticle);
    }

    await transaction.commit();

    return res.status(201).json({
      message: "Devis créé avec succès.",
      devis,
      articles: insertedArticles,
      mlettre, // Renvoi de la chaîne générée dans la réponse
    });
  } catch (error) {
    console.error("Erreur lors de la création du devis :", error);
    return res.status(500).json({
      message: "Erreur lors de la création du devis.",
      error: error.errors ? error.errors : error.message,
    });
  }
};


const updateDevis = async (req, res) => {
  const { dbName } = req.params;
  const { NUMBL, code, rsoc, articles } = req.body;

  console.log("NUMBL reçu:", NUMBL); 
  console.log("Code client reçu:", code); 
  console.log("Articles reçus :", articles);

  // Validation des champs requis
  if (!NUMBL || NUMBL.trim() === "") {
    return res.status(400).json({ message: "Le champ NUMBL est manquant." });
  }
  if (!code || code.trim() === "") {
    return res.status(400).json({ message: "Le code client est manquant." });
  }
  

  try {
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();

    const Dfp = defineDfpModel(dynamicSequelize);
    const Ldfp = defineLdfpModel(dynamicSequelize);
    const Client = defineClientModel(dynamicSequelize);

    const transaction = await dynamicSequelize.transaction();

   
    const existingDevis = await Dfp.findOne({ where: { NUMBL } });
    if (!existingDevis) {
      return res.status(404).json({ message: `Le devis avec le numéro ${NUMBL} n'existe pas.` });
    }

   
    const client = await Client.findOne({ where: { code } });
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

   
    const updatedDevis = await existingDevis.update(
      {
        CODECLI: client.code,
        rsoc,
      },
      { transaction }
    );

   
    await Ldfp.destroy({ where: { NUMBL }, transaction });

    const updatedArticles = [];

    
    for (const article of articles) {
      if (!article.code || !article.libelle || !article.nbrunite || !article.prix1 || !article.tauxtva) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Tous les champs nécessaires pour l'article doivent être fournis.",
        });
      }

      const articleData = {
        NUMBL,
        CodeART: article.code,
        DesART: article.libelle,
        QteART: article.nbrunite,
        PUART: article.prix1,
        Remise: article.Remise,
        TauxTVA: article.tauxtva,
        Unite: article.unite || "unité",
        Conf: article.CONFIG || "",
        famille: article.famille || "",
        nbun: article.nbrunite,
      };

      const updatedArticle = await Ldfp.create(articleData, { transaction });
      updatedArticles.push(updatedArticle);
    }

   
    await transaction.commit();

    return res.status(200).json({
      message: "Devis modifié avec succès.",
      devis: {
        NUMBL: updatedDevis.NUMBL,
        CODECLI: updatedDevis.CODECLI,
       
        articles: updatedArticles,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la modification du devis :", error);
    await transaction.rollback();
    return res.status(500).json({
      message: "Erreur lors de la modification du devis.",
      error: error.errors ? error.errors : error.message,
    });
  }
};



const getCodeRepAndRsRep = async (req, res) => {

  const { databaseName } = req.params;  
  if (!databaseName) {
    return res.status(400).json({ message: 'Le nom de la base de données est requis.' });
  }

  try {
    const dbConnection = new Sequelize(`mysql://root:@127.0.0.1:3306/${databaseName}`, {
      dialect: 'mysql',
      logging: false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    });

    await dbConnection.authenticate();

    
    const result = await dbConnection.query(
      `SELECT dfp.CODEREP, dfp.RSREP
       FROM dfp`,
      {
        type: dbConnection.QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Aucune information trouvée dans la base de données.' });
    }

   
    res.status(200).json({
      message: 'Informations CODEREP et RSREP récupérées avec succès.',
      data: result, 
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des informations CODEREP et RSREP :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des informations CODEREP et RSREP.' });
  }
};



module.exports = {
  getAllClients,
  getClientByCode,
  getClientByRsoc,
  getAllDevis,
  getLibpvByNumbl,
  getDevisWithDetails,
  getDevisCountByMonthAndYear ,
  getTotalDevis,
  getDevisValidees,
  createDevis,
  getCodeRepAndRsRep,
  updateDevis
 

  
};
