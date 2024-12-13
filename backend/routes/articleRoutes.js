const express = require('express'); 
const router = express.Router(); 
const { getFamilles ,getCodesByFamille,getArticleDetailsByCode} = require('../controllers/articleController'); 


router.get('/familles', getFamilles);
router.get("/codes/famille/:famille", getCodesByFamille);
router.get("/articles/details/:code", getArticleDetailsByCode);

module.exports = router;
