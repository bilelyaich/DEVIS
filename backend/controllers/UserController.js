const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Representant = require('../models/representant');
const User = require ('../models/User')

const { sequelizeUserERP } = require('../db/config'); 
const getAllCodesRepresentants = async (req, res) => {
  try {
   
    const representants = await Representant.findAll({
      attributes: ['Code']  
    });

    const Code = representants.map(representant => representant.Code);
     
   
    return res.status(200).json({ Code });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la récupération des codes" });
  }
};        

const registerUser = async (req, res) => {
  const { email, motpasse, nom, codeuser } = req.body;  

  try {
  
    if (!email || !motpasse || !nom || !codeuser) {
      return res.status(400).json({ message: 'Tous les champs doivent être remplis.' });
    }

  
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

  
    const hashedPassword = await bcrypt.hash(motpasse, 10);

   
    const newUser = await User.create({
      codeuser,         
      email,
      motpasse: hashedPassword,
      nom,
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      user: {
        codeuser: newUser.codeuser, 
        email: newUser.email,
        nom: newUser.nom,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error.message || error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'utilisateur.', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, motpasse } = req.body;
  try {
    if (!email || !motpasse) {
      return res.status(400).json({ message: 'Tous les champs doivent être remplis.' });
    }

    const user = await User.findOne({ where: { email } }); 

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    if (user.motpasse !== motpasse) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { codeuser: user.codeuser },
      'fioujgirjiogjogjktrg',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Connexion réussie.',
      token: token,
      user: {
        codeuser: user.codeuser,
        nom: user.nom,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion de l\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
  }
};


module.exports = { 
  
  getAllCodesRepresentants,
  registerUser,
  loginUser

};
