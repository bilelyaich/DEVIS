const express = require('express');
const router = express.Router();
const authenticateJWT = require('../authentification/authenticateToken');
const { registerUser, loginUser, selectDatabase, getLatestDevisByYear } = require('../controllers/UserController'); // Ajout de getDevisDetails
const { getDevisDetails, } = require('../controllers/UserController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/select-database', selectDatabase);
router.get('/get-devis-details/:databaseName/:NUMBL', getDevisDetails);

router.get('/get-devis-details/:databaseName', getLatestDevisByYear);


module.exports = router;
