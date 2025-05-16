const { Compte } = require("../models");
const CompteService = require("../services/CompteService");
const bcrypt = require("bcrypt");

exports.createCompte = async (req, res) => {
  const { numCompte, taux, decouverte, type, idClient, solde } = req.body;
  try {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];

    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    const hashedPin = await bcrypt.hash(pin, 10);

    const data = {
      NumCompte: numCompte,
      Solde: solde,
      DateOuverture: formattedDate,
      StatusCompte: "Actif",
      Decouvert: decouverte,
      Taux: taux,
      UtilisateurClient: idClient,
      Discriminator: type,
      Pin: hashedPin,
    };

    const newCompte = await CompteService.createCompte(data);
    res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      compte: newCompte,
      codePin: pin,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.checkExistingCompte = async (req, res) => {
  const { numCompte } = req.body;

  try {
    const existing = await CompteService.findByNumCompte(numCompte);

    if (existing) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCompte = async (req, res) => {
  const { id } = req.params;
  const { solde, taux, decouverte } = req.body;
  try {
    const updatedCompte = await CompteService.updateCompte(id, {
      Solde: solde,
      Taux: taux,
      Decouvert: decouverte,
    });
    if (!updatedCompte) {
      return res
        .status(404)
        .json({ success: false, message: "Compte non trouvé" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Compte mis à jour avec succès" });
  } catch (error) {
    console.error(error);
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

exports.deleteCompte = async (req, res) => {
  const { id } = req.params;
  try {
    await CompteService.deleteCompte(id);
    res.status(204).json({
      success: true,
      message: "Compte supprimé avec succès",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCompteCount = async (req, res) => {
  try {
    const count = await CompteService.getCompteCount();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTotalCurrent = async (req, res) => {
  try {
    const total = await CompteService.getTotalCurrent();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
