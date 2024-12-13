const express = require('express');
const router = express.Router();
const { getAllCodesRepresentants,registerUser,loginUser} = require('../controllers/UserController');  

router.get('/codes-representants', getAllCodesRepresentants);

router.post('/register', registerUser);
router.post('/login', loginUser);
module.exports = router;
 