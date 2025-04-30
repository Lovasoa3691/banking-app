const Operation = require("../models/Operation");
const OperationService = require("../services/OperationService");

exports.getAll = async (req, res) => {
  try {
    const data = await OperationService.getAllSendData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllPret = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await OperationService.getAllExchange(id);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRetrait = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await OperationService.getAllWithdraw(id);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllVirement = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await OperationService.getAllSend(id);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOperations = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await OperationService.getAllOperationOneClient(id);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

exports.doRetrait = async (req, res) => {
  const { numCompte, montant, motif } = req.body;
  try {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];

    const data = {
      NumOp: null,
      Montant: montant,
      NumCompte: numCompte,
      Motif: motif,
      DateOp: formattedDate,
      Discriminator: "Retrait",
    };
    const newRetrait = await OperationService.doWithdraw(data);
    res.status(201).json(newRetrait);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.doVirement = async (req, res) => {
  const { numCompte, destinataire, montant, motif } = req.body;
  try {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];

    const data = {
      NumOp: null,
      NumCompte: numCompte,
      Montant: montant,
      NumDest: destinataire,
      Motif: motif,
      DateOp: formattedDate,
      Discriminator: "Virement",
    };
    const newVirement = await OperationService.doSend(data);
    res.status(201).json(newVirement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.doPret = async (req, res) => {
  const { numCompte, duree, revenu, montant, motif } = req.body;
  try {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];

    const data = {
      NumOp: null,
      NumCompte: numCompte,
      Montant: montant,
      Motif: motif,
      StatusP: "En attente",
      Duree: duree,
      Revenu: revenu,
      DateOp: formattedDate,
      Discriminator: "Pret",
    };
    const newPret = await OperationService.doExchange(data);
    res.status(201).json(newPret);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteHistorique = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await OperationService.deleteHistorique(id);
    if (deleted) {
      res.json({ success: true, message: "Information supprimé" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
