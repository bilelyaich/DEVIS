const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Récupérer le token de l'en-tête Authorization
  const token = req.headers['authorization']?.split(' ')[1];  // Attendu sous forme "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: "Accès interdit, token manquant" });
  }

  // Vérifier le token avec la clé secrète
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }
 
    req.user = user;  // Ajouter l'utilisateur au `req` pour l'utiliser dans les autres routes
    next();
  });
};

module.exports = authenticateToken;
