const express = require('express');
const router = express.Router();
const { getAllClients,getClientByCode, getClientByRsoc,getAllDevis,getLibpvByNumbl,getDevisWithDetails,getDevisByNumbl,getDevisByMonth,getTotalDevisCount,getDevisStats} = require('../controllers/devisController');
const { getAllcodearticle } = require('../controllers/articleController');


router.get('/clients', getAllClients);
router.get('/clients/code/:code', getClientByCode); 
router.get('/clients/rsoc/:rsoc', getClientByRsoc);  
router.get('/article', getAllcodearticle);
router.get("/devis", getAllDevis);
router.get('/devis/libpv/:numbl', getLibpvByNumbl);
router.get('/devis/details', getDevisWithDetails);
router.get('/devis/:numbl', getDevisByNumbl);

router.get('/devis-by-month', getDevisByMonth);
router.get("/total-devis", getTotalDevisCount);
router.get("/devis/stats", getDevisStats); 

module.exports = router;
                            