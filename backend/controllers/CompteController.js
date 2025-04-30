const { Compte } = require("../models");
const CompteService = require("../services/CompteService");

exports.createCompte = async (req, res) => {
  try {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];

    const data = {
      NumCompte: "4253 2238 0739 9435",
      Solde: 0.0,
      DateOuverture: formattedDate,
      StatusCompte: "Actif",
      Taux: 0.15,
      UtilisateurClient: 2,
      Discriminator: "Courant",
    };

    const newCompte = await CompteService.createCompte(data);
    res.status(201).json(newCompte);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCompteByClient = async (req, res) => {
  try {
    const data = await CompteService.getCompteByClient();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCompte = async (req, res) => {
  try {
    const data = await CompteService.getAllCompte();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
