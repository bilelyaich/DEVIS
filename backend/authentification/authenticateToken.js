const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  
  const token = req.headers['authorization']?.split(' ')[1];  

  if (!token) {
    return res.status(403).json({ message: "Accès interdit, token manquant" });
  }

 
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }
 
    req.user = user;
    next();
  });
};


module.exports = authenticateToken;
