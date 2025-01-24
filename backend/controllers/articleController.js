const { Sequelize } = require("sequelize");
const defineArticleModel = require("../models/article");
const defineLdfpModel = require("../models/Ldfp");
const { getSequelizeConnection } = require("../db/config");



const initializeDynamicModels = (sequelize) => {
  const Article = defineArticleModel(sequelize); 
  const Ldfp = defineLdfpModel(sequelize);

  return { Article, Ldfp }; 
};


const getFamilles = async (req, res) => {
  const { dbName } = req.params;

  if (!dbName) {
    return res.status(400).json({
      message: "Le nom de la base de données est requis.",
    });
  }

  try {
    
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();

   
    const { Article } = initializeDynamicModels(dynamicSequelize);

    
    const familles = await Article.findAll({
      attributes: ["famille"],
      group: ["famille"],
    });

    if (familles.length === 0) {
      return res.status(404).json({
        message: "Aucune famille d'article trouvée.",
      });
    }

    return res.status(200).json({
      message: "Familles d'articles récupérées avec succès.",
      familles: familles.map((famille) => famille.famille),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des familles des articles.",
      error: error.message,
    });
  }
};
const getAllcodearticle = async (req, res) => {
  const { dbName } = req.params;

  if (!dbName) {
    return res.status(400).json({
      message: "Le nom de la base de données est requis.",
    });
  }

  try {
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();
    const { Article } = initializeDynamicModels(dynamicSequelize);

    const articles = await Article.findAll({
      attributes: ["code"],
    });

    if (articles.length === 0) {
      return res.status(404).json({
        message: "Aucun article trouvé.",
      });
    }

    return res.status(200).json({
      message: "Codes des articles récupérés avec succès.",
      articles,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error.message);
    return res.status(500).json({
      message: "Erreur lors de la récupération des articles.",
      error: error.message,
    });
  }
};



const getCodesByFamille = async (req, res) => {
  const { dbName, famille } = req.params;

  if (!dbName || !famille) {
    return res.status(400).json({
      message: "Le nom de la base de données et la famille sont requis.",
    });
  }

  try {
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();

    const { Article } = initializeDynamicModels(dynamicSequelize);

    const articles = await Article.findAll({
      attributes: ["code", "libelle", "unite", "puht", "tauxtva","prix1"],
      where: {
        famille: famille,
      },
    });

    if (articles.length === 0) {
      return res.status(404).json({
        message: `Aucun article trouvé pour la famille ${famille}`,
      });
    }

    return res.status(200).json({
      message: `Articles pour la famille ${famille} récupérés avec succès`,
      articles: articles.map((article) => ({
        code: article.code,
        libelle: article.libelle,
        unite: article.unite,
        prix1: article.prix1,
        tauxtva: article.tauxtva,
        
      })),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des articles par famille:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des articles",
      error: error.message,
    });
  }
};


const getArticleDetailsByCode = async (req, res) => {
  const { dbName, code } = req.params; 

  if (!dbName || !code) {
    return res.status(400).json({
      message: "Le nom de la base de données et le code de l'article sont requis",
    });
  }

  try {
   
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate(); 

    
    const { Article } = initializeDynamicModels(dynamicSequelize);

    
    const article = await Article.findOne({
      attributes: [
        "libelle",
        "unite",
        "nbrunite",
        "code",
        "prix1",
        "tauxtva",
        "CONFIG",
      ], 
      where: { 
        code: code, 
      },
    });

  
    if (!article) {
      return res.status(404).json({
        message: `Aucun article trouvé avec le code ${code}`,
      });
    }

    
    return res.status(200).json({
      message: `Détails de l'article pour le code ${code} récupérés avec succès`,
      article: {
        code: article.code,
        libelle: article.libelle,
        unite: article.unite,
        nbrunite: article.nbrunite,
        prix1: article.prix1,
        tauxtva: article.tauxtva,
        CONFIG: article.CONFIG,
      },
    });
  } catch (error) {
    
    console.error("Erreur lors de la récupération des détails de l'article:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des détails de l'article",
      error: error.message,
    });
  }
};


const updateConfig = async (req, res) => {
  const { dbName, code } = req.params;
  const { newConfigValue } = req.body; 

  if (!dbName || !code || !newConfigValue) {
    return res.status(400).json({
      message: "Le nom de la base de données, le code de l'article et la nouvelle configuration sont requis."
    });
  }

  try {
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();
    const { Article, Ldfp } = initializeDynamicModels(dynamicSequelize);

    
    const article = await Article.findOne({ where: { code } });

    if (!article) {
      return res.status(404).json({ message: "Article non trouvé." });
    }

  article.CONFIG = newConfigValue;
    await article.save();

    const existingEntry = await Ldfp.findOne({ where: { CodeART: code } });

    if (existingEntry) {
      existingEntry.Conf = newConfigValue;
      await existingEntry.save();
      return res.status(200).json({
        message: "Configuration mise à jour avec succès.",
        updatedArticle: article,
        updatedLdfpEntry: existingEntry,
      });
    } else {
      const newLdfpEntry = await Ldfp.create({
        CodeART: code,
        Conf: newConfigValue,
      });
      return res.status(200).json({
        message: "Nouvelle entrée créée avec succès.",
        updatedArticle: article,
        newLdfpEntry: newLdfpEntry,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


const getSearchResultsByClientOrNumbl = async (req, res) => {
  const { dbName, searchType, searchTerm } = req.params;

  // Vérification des paramètres
  if (!dbName || !searchType || !searchTerm) {
    return res.status(400).json({
      message: "Le nom de la base de données, le type de recherche et le terme de recherche sont requis.",
    });
  }

  try {
    // Connexion à la base de données dynamique
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();

    // Construire la clause WHERE en fonction du type de recherche
    let whereClause;
    if (searchType === "client") {
      whereClause = "dfp.CODECLI = :searchTerm";
    } else if (searchType === "numbl") {
      whereClause = "dfp.NUMBL = :searchTerm";
    } else {
      return res.status(400).json({
        message: "Le type de recherche doit être 'client' ou 'numbl'.",
      });
    }

    // Requête SQL avec la clause WHERE dynamique
    const query = `
      SELECT 
        dfp.NUMBL,
        dfp.ADRCLI,
        dfp.CODECLI,
        dfp.CODEFACTURE,
        dfp.CP,
        dfp.MTTC,
        dfp.rsoc,
        ldfp.CODEART,
        ldfp.DESART,
        ldfp.QTEART,
        ldfp.REMISE,
        ldfp.TAUXTVA
      FROM dfp
      LEFT JOIN ldfp ON dfp.NUMBL = ldfp.NUMBL
      WHERE ${whereClause}
    `;

    // Exécuter la requête
// Exécuter la requête
const results = await dynamicSequelize.query(query, {
  replacements: { searchTerm }, // Injecter le terme de recherche dans la requête
  type: dynamicSequelize.QueryTypes.SELECT,
});

// Vérifiez si "results" est un tableau
if (!Array.isArray(results) || results.length === 0) {
  return res.status(404).json({
    message: "Aucun résultat trouvé pour les critères donnés.",
  });
}


    

    // Formater les résultats
    return res.status(200).json({
      message: "Résultats récupérés avec succès.",
      results: results.map(result => ({

        NUMBL: result.NUMBL,
        ADRCLI: result.ADRCLI,
        CODECLI: result.CODECLI,
        CODEFACTURE: result.CODEFACTURE,
        CP: result.CP,
        MTTC: result.MTTC,
        rsoc: result.rsoc,
        CODEART: result.CODEART,
        DESART: result.DESART,
        QTEART: result.QTEART,
        REMISE: result.REMISE,
        TAUXTVA: result.TAUXTVA,
      })),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des résultats :", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des résultats.",
      error: error.message,
    });
  }
};



const getAllCodeCli = async (req, res) => {
  const { dbName } = req.params;

  if (!dbName) {
    return res.status(400).json({
      message: "Le nom de la base de données est requis.",
    });
  }

  try {
   
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();
    console.log(`Connexion réussie à la base de données : ${dbName}`);

     const query = 'SELECT DISTINCT CODECLI FROM dfp';
    let [results] = await dynamicSequelize.query(query, {
      type: dynamicSequelize.QueryTypes.SELECT,
    });

    
    console.log("Résultats bruts de la requête : ", JSON.stringify(results));

    
    if (!Array.isArray(results)) {
      results = [results];
    }

  
    if (results.length > 0) {
      
      const codesClients = results.map(result => result.CODECLI);
      console.log("Codes clients extraits : ", codesClients);

      return res.status(200).json({
        message: "Codes clients récupérés avec succès.",
        codecli: codesClients,
      });
    } else {
      return res.status(404).json({
        message: "Aucun code client trouvé pour cette base de données.",
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des codes clients :", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des codes clients.",
      error: error.message,
    });
  }
};

const getLastNumbl = async (req, res) => {
  const { dbName } = req.params;
  const { datebl } = req.query;
  
 
  const year = new Date(datebl).getFullYear();
  
  if (!dbName || !datebl) {
    return res.status(400).json({
      message: "Le nom de la base de données et la date de BL sont requis.",
    });
  }
  
  try {
    const dynamicSequelize = getSequelizeConnection(dbName);
    await dynamicSequelize.authenticate();
  
    const numblRecords = await dynamicSequelize.query(
      'SELECT NUMBL FROM dfp WHERE YEAR(DATEBL) = :year ORDER BY NUMBL DESC limit 1', 
      {
        replacements: { year },
        type: dynamicSequelize.QueryTypes.SELECT,
      }
    );
  
    if (numblRecords.length === 0) {
      const yearSuffix = new Date(datebl).getFullYear().toString().slice(2);
      const newNUMBL = `PF${yearSuffix}00001`;
  
      return res.status(200).json({
        message: "Aucun NUMBL trouvé pour cette date. Nouveau NUMBL généré.",
        newNUMBL ,
      });
    }
  
    const lastNumblValue = numblRecords[0].NUMBL;
    const lastNumblIncrement = parseInt(lastNumblValue.slice(6)) + 1;
  
    const yearSuffix = lastNumblValue.slice(2, 4);
    const newNUMBL = `PF${yearSuffix}${lastNumblIncrement.toString().padStart(5, '0')}`;
  
    return res.status(200).json({
      message: "Dernier NUMBL récupéré et nouveau NUMBL généré avec succès.",
      lastNUMBL : lastNumblValue,
      newNUMBL ,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du dernier NUMBL:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération du dernier NUMBL.",
      error: error.message,
    });
  }
};


module.exports = {
  getAllcodearticle,
  getFamilles,
  getCodesByFamille,
  getArticleDetailsByCode,
  updateConfig,
  getSearchResultsByClientOrNumbl,
  getAllCodeCli,
  getLastNumbl
};
