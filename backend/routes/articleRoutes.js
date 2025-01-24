const express = require('express'); 
const router = express.Router(); 
const { getFamilles ,getCodesByFamille,getArticleDetailsByCode,updateConfig,getSearchResultsByClientOrNumbl,getAllCodeCli,getLastNumbl} = require('../controllers/articleController'); 


router.get('/:dbName/familles', getFamilles);
router.get("/:dbName/codes/famille/:famille", getCodesByFamille);
router.get("/:dbName/articles/details/:code", getArticleDetailsByCode);
router.post("/:dbName/articles/:code/updateConfig", updateConfig);
router.get("/search/:searchType/:dbName/:searchTerm", getSearchResultsByClientOrNumbl);

router.get('/code/:dbName', getAllCodeCli);
router.get('/:dbName/last-numbl', getLastNumbl);

module.exports = router;
