const express = require('express');
const router = express.Router();
const { getAllClients,getClientByCode, getClientByRsoc,getAllDevis,getLibpvByNumbl,getDevisWithDetails,getTotalDevis,getDevisCountByMonthAndYear,getDevisValidees,createDevis,getCodeRepAndRsRep,updateDevis} = require('../controllers/devisController');
const { getAllcodearticle } = require('../controllers/articleController');


router.get("/:dbName/clients", getAllClients);
router.get('/:dbName/clients/code/:code', getClientByCode); 
router.get('/:dbName/clients/rsoc/:rsoc', getClientByRsoc);  
router.get('/:dbName/article', getAllcodearticle);
router.get("/:dbName/devis", getAllDevis);
router.get('/:dbName/devis/libpv/:numbl', getLibpvByNumbl);
router.get('/:dbName/devis/details', getDevisWithDetails);
router.get("/devis-count-by-month-and-year/:dbName", getDevisCountByMonthAndYear);
router.get('/:dbName/devis/total',getTotalDevis);
router.get("/:dbName/devis-validees",getDevisValidees); 
router.post('/:dbName/create', createDevis);
router.get('/get-representant-details/:databaseName/:numbl', getCodeRepAndRsRep);
router.put("/:dbName/:numbl", updateDevis);


module.exports = router;