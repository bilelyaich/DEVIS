const sequelize = require("../db/config");
const Article = require("../models/article");

const getAllcodearticle = async (_req, res) => {
  try {
   
    if (!Article) {
      return res.status(500).json({
        message: "Le modèle Article n'est pas correctement importé",
      });
    }

    const articles = await Article.findAll({
      attributes: ["code"],
    });

    if (articles.length === 0) {
      return res.status(404).json({
        message: "Aucun article trouvé",
      });
    }

    return res.status(200).json({
      message: "Codes des articles récupérés avec succès",
      articles,
    });
  } catch (error) {
    console.error("Erreur dans la récupération des articles:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des articles",
      error: error.message,
    });
  }
};

const getFamilles = async (_req, res) => {
  try {
    const familles = await Article.findAll({
      attributes: ["famille"],
      group: ["famille"],
    });

    if (familles.length === 0) {
      return res.status(404).json({
        message: "Aucune famille d'article trouvée",
      });
    }

    return res.status(200).json({
      message: "Familles d'articles récupérées avec succès",
      familles: familles.map((famille) => famille.famille),
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des familles des articles:",
      error
    );
    return res.status(500).json({
      message: "Erreur lors de la récupération des familles des articles",
      error: error.message,
    });
  }
};


const getCodesByFamille = async (req, res) => {
  try {
    const { famille } = req.params; 

    if (!famille) {
      return res.status(400).json({
        message: "La famille est requise",
      });
    }

    // On récupère les codes, libellé, unité et puht des articles
    const articles = await Article.findAll({
      attributes: ["code", "libelle", "unite", "puht","tauxtva"],  // Ajout des attributs libelle, unite et puht
      where: {
        famille: famille, 
      },
    });

    if (articles.length === 0) {
      return res.status(404).json({
        message: `Aucun article trouvé pour la famille ${famille}`,
      });
    }

    // Retourne les articles avec leurs informations (code, libelle, unite, puht)
    return res.status(200).json({
      message: `Articles pour la famille ${famille} récupérés avec succès`,
      articles: articles.map((article) => ({
        code: article.code,
        libelle: article.libelle,
        unite: article.unite,
        puht: article.puht,
        tauxtva: article.tauxtva
      })),
    });
  } catch (error) {
    console.error("Erreur dans la récupération des articles par famille:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des articles",
      error: error.message,
    });
  }
};



const getArticleDetailsByCode = async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({
        message: "Le code de l'article est requis",
      });
    }

    
    const article = await Article.findOne({
      attributes: ["libelle", "unite", "nbrunite", "code","puht","tauxtva"], 
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
        puht:article.puht, 
        tauxtva:article.tauxtva 
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

module.exports = {
  getAllcodearticle,
  getFamilles,
  getCodesByFamille,
  getArticleDetailsByCode,  
};
