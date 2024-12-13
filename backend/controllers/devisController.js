const Client = require("../models/client");
const sequelize = require("../db/config");
const Devis = require("../models/Devis");
const Article = require("../models/article");
const { sequelizeLC24 } = require("../db/config");

const { QueryTypes } = require("sequelize");
const getAllClients = async (_req, res) => {
  try {
    const clients = await Client.findAll({
      attributes: ["code", "rsoc"],
    });

    if (clients.length === 0) {
      return res.status(404).json({
        message: "Aucun client trouvé",
      });
    }

    return res.status(200).json({
      message: "Codes et raisons sociales des clients récupérés avec succès",
      clients,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des clients",
      error: error.message,
    });
  }
};

const getClientByCode = async (req, res) => {
  try {
    const { code } = req.params;

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
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des détails du client",
      error: error.message,
    });
  }
};

const getClientByRsoc = async (req, res) => {
  try {
    const { rsoc } = req.params;
    console.log("Recherche du client par rsoc : ", rsoc);

    const client = await Client.findOne({
      where: { rsoc: rsoc },
      attributes: ["code", "rsoc", "adresse", "cp", "email", "tel1"],
    });

    if (!client) {
      console.log("Aucun client trouvé avec la raison sociale", rsoc);
      return res.status(404).json({
        message: "Client non trouvé",
      });
    }

    return res.status(200).json({
      message: "Détails du client récupérés avec succès",
      client,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du client", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des détails du client",
      error: error.message,
    });
  }
};

function incrementNumbl(numbl) {
  const prefix = numbl.slice(0, -7);
  const num = numbl.slice(-7);

  const nextNum = (parseInt(num, 10) + 1).toString().padStart(7, "0");

  return prefix + nextNum;
}

const getAllDevis = async (req, res) => {
  try {
    const devisList = await Devis.findAll({
      attributes: ["NUMBL", "libpv"],
    });

    if (devisList.length === 0) {
      return res.status(404).json({
        message: "Aucun devis trouvé.",
      });
    }

    return res.status(200).json({
      message: "Devis trouvés avec succès",
      devisList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des devis",
      error: error.message,
    });
  }
};

const getLibpvByNumbl = async (req, res) => {
  try {
    const { numbl } = req.params;

    const devis = await Devis.findOne({
      where: { NUMBL: numbl },
      attributes: ["libpv"],
    });

    if (!devis) {
      return res.status(404).json({
        message: `Aucun devis trouvé avec le NUMBL : ${numbl}`,
      });
    }

    return res.status(200).json({
      message: "libpv récupéré avec succès",
      libpv: devis.libpv,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la récupération du libpv",
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
          CP: item["client.CP"] || null,
          RSCLI: item["client.RSCLI"] || null,
          MTTC: item["client.MTTC"] || null,
        },
        articles: [],
      };
    }

    if (item["articles.CodeART"]) {
      acc[numbl].articles.push({
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
  try {
    const result = await sequelizeLC24.query(
      `
      SELECT 
        Devis.NUMBL, 
          Devis.libpv AS "client.libpv", 
        Devis.ADRCLI AS "client.ADRCLI", 
        Devis.CODECLI AS "client.CODECLI", 
        Devis.CP AS "client.CP", 
        Devis.RSCLI AS "client.RSCLI", 
        Devis.MTTC AS "client.MTTC",
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
      return res.status(404).json({ message: "Aucun devis trouvé." });
    }

    const formattedDevis = formatDevisData(result);

    res.status(200).json(formattedDevis);
  } catch (error) {
    console.error("Erreur lors de la récupération des devis :", error);
    res
      .status(500)
      .json({
        error: "Une erreur est survenue lors de la récupération des devis.",
      });
  }
};


const getDevisByNumbl = async (req, res) => {
  try {
    const { numbl } = req.params;  

   
    if (!numbl) {
      return res.status(400).json({ message: "Le paramètre NUMBL est requis." });
    }

    
    const result = await sequelizeLC24.query(
      `SELECT 
        Devis.\`NUMBL\`, 
        Devis.\`libpv\` AS \`client.libpv\`, 
        Devis.\`ADRCLI\` AS \`client.ADRCLI\`, 
        Devis.\`CODECLI\` AS \`client.CODECLI\`, 
        Devis.\`CP\` AS \`client.CP\`, 
        Devis.\`RSCLI\` AS \`client.RSCLI\`, 
        Devis.\`MTTC\` AS \`client.MTTC\`,
        articles.\`CodeART\` AS \`articles.CodeART\`, 
        articles.\`DesART\` AS \`articles.DesART\`, 
        articles.\`QteART\` AS \`articles.QteART\`, 
        articles.\`Remise\` AS \`articles.Remise\`, 
        articles.\`TauxTVA\` AS \`articles.TauxTVA\`
      FROM dfp AS Devis
      LEFT JOIN ldfp AS articles ON Devis.\`NUMBL\` = articles.\`NUMBL\`
      WHERE Devis.\`NUMBL\` = :numbl`, 

      {
        type: QueryTypes.SELECT, 
        replacements: { numbl }, 
      }
    );

    if (result.length === 0) {
      return res.status(404).json({ message: `Aucun devis trouvé pour le NUMBL : ${numbl}` });
    }

    const formattedDevis = formatDevisData(result);  

    res.status(200).json(formattedDevis);  
  } catch (error) {
    console.error("Erreur lors de la récupération du devis :", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération du devis.",
      error: error.message,
    });
  }
};


const getDevisByMonth = async (req, res) => {
  try {
    // Récupération de tous les devis regroupés par année et mois
    const result = await sequelizeLC24.query(
      `
      SELECT 
        DATE_FORMAT(datedmaj, '%Y-%m') AS mois, 
        COUNT(*) AS nombreDevis
      FROM dfp
      GROUP BY DATE_FORMAT(datedmaj, '%Y-%m')
      ORDER BY DATE_FORMAT(datedmaj, '%Y-%m') ASC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Aucun devis trouvé." });
    }

    return res.status(200).json({
      message: "Nombre de devis récupéré avec succès, regroupés par année et mois.",
      data: result,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des devis par mois :", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des devis.",
      error: error.message,
    });
  }
};
const getTotalDevisCount = async (req, res) => {
  try {
    // Query to count the total number of devis in the dfp table
    const result = await sequelizeLC24.query(
      `SELECT COUNT(*) AS totalDevis FROM dfp`,
      { type: QueryTypes.SELECT }
    );

    // If no data is found (which is unlikely for a count query), send a 404 response
    if (result.length === 0) {
      return res.status(404).json({
        message: "Aucun devis trouvé.",
      });
    }

    // Respond with the total number of devis
    return res.status(200).json({
      message: "Nombre total des devis récupéré avec succès.",
      totalDevis: result[0].totalDevis,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre total de devis :", error);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la récupération du nombre total de devis.",
      error: error.message,
    });
  }
};


const getDevisStats = async (_req, res) => {
  try {
    // On ne filtre pas par NUMBL ici, on récupère directement les stats
    const result = await sequelize.query(
      `SELECT 
        COUNT(*) AS totalDevis, 
        SUM(CASE WHEN LOWER(status) = 'validé' THEN 1 ELSE 0 END) AS totalValidé, 
        SUM(CASE WHEN LOWER(status) = 'en attente' THEN 1 ELSE 0 END) AS totalEnAttente
      FROM dfp`,
      { type: QueryTypes.SELECT }
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Aucun devis trouvé." });
    }

    res.status(200).json({
      totalDevis: result[0].totalDevis,
      totalValidé: result[0].totalValidé,
      totalEnAttente: result[0].totalEnAttente,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques des devis :", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des statistiques des devis.",
      error: error.message,
    });
  }
};




module.exports = {
  getAllClients,
  getClientByCode,
  getClientByRsoc,
  getAllDevis,
  getLibpvByNumbl,
  getDevisWithDetails,
  getDevisByNumbl,
  getDevisByMonth,
  getTotalDevisCount,
  getDevisStats
};
