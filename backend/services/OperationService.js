const { Compte, Operation, Utilisateur, Connexion } = require("../models");
const bcrypt = require("bcrypt");

class OperationService {
  static async doWithdraw(data) {
    return Operation.create({
      ...data,
    });
  }

  static async checkPin(num, pin) {
    const compte = await Compte.findOne({
      where: { NumCompte: num },
    });

    if (!compte) {
      throw new Error("Compte introuvable");
    }

    const pinIsValid = await bcrypt.compare(pin, compte.Pin);
    if (!pinIsValid) {
      throw new Error("Code PIN incorrect");
    }

    return compte;
  }

  static async checkSolde(num, montant) {
    const compte = await Compte.findOne({
      where: { NumCompte: num },
    });
    if (!compte) {
      throw new Error("Compte introuvable");
    }
    if (compte.Solde < montant) {
      throw new Error("Solde insuffisant");
    }
    return compte;
  }

  static async updateSolde(num, montant) {
    const compte = await Compte.findOne({
      where: { NumCompte: num },
    });
    if (!compte) {
      throw new Error("Compte introuvable");
    }
    compte.Solde -= montant;
    await compte.save();
    return compte;
  }

  static async updateSoldeVirement(num, montant) {
    const compte = await Compte.findOne({
      where: { NumCompte: num },
    });
    if (!compte) {
      throw new Error("Compte introuvable");
    }
    compte.Solde -= montant;
    await compte.save();
    return compte;
  }

  static async doSend(data) {
    return Operation.create({
      ...data,
    });
  }

  static async doExchange(data) {
    return Operation.create({
      ...data,
    });
  }

  static async getAllWithdraw(num) {
    return Operation.findAll({
      where: { NumCompte: num, Discriminator: "Retrait" },
    });
  }

  static async getAllSend(num) {
    return Operation.findAll({
      where: { NumCompte: num, Discriminator: "Virement" },
    });
  }

  static async getAllSendData() {
    return Operation.findAll({
      where: { Discriminator: "Virement" },
      include: [
        {
          model: Compte,
          as: "Compte",
        },
      ],
    });
  }

  static async getAllExchange(num) {
    return Operation.findAll({
      where: { NumCompte: num, Discriminator: "Pret" },
    });
  }

  static async findOneOperation(id) {
    return Operation.findOne({
      where: { NumOp: id },
      include: {
        model: Compte,
        as: "Operations",
        include: {
          model: Utilisateur,
          as: "Client",
          include: {
            model: Connexion,
            as: "Utilisateur",
          },
        },
      },
    });
  }

  static async getAllExchangeData() {
    return Operation.findAll({
      where: { Discriminator: "Pret" },
      include: [
        {
          model: Compte,
          as: "Operations",
        },
      ],
    });
  }

  static async deleteHistorique(id) {
    return Operation.destroy({
      where: { NumOp: id },
    });
  }

  static async getAllOperationOneClient(num) {
    return Operation.findAll({
      order: [["NumOp", "DESC"]],
      limit: 10,
      // OperationService,
      where: { NumCompte: num },
    });
  }

  static async updateStatusPret(id, statut) {
    return Operation.update(
      { StatusP: statut },
      {
        where: { NumOp: id },
      }
    );
  }

  static async getTotalRetrait() {
    return Operation.sum("Montant", {
      where: { Discriminator: "Retrait" },
    });
  }

  static async getTotalRetraitByClient(num) {
    return Operation.sum("Montant", {
      where: { Discriminator: "Retrait", NumCompte: num },
    });
  }
  static async getTotalVirementByClient(num) {
    return Operation.sum("Montant", {
      where: { Discriminator: "Virement", NumCompte: num },
    });
  }
  static async getTotalPretByClient(num) {
    return Operation.sum("Montant", {
      where: { Discriminator: "Pret", NumCompte: num, StatusP: "Accepte" },
    });
  }

  static async getTotalVirement() {
    return Operation.sum("Montant", {
      where: { Discriminator: "Virement" },
    });
  }

  static async getTotalPret() {
    return Operation.sum("Montant", {
      where: { Discriminator: "Pret", StatusP: "Accepte" },
    });
  }

  static async getCurrentOperation() {
    return Operation.findAll({
      order: [["NumOp", "DESC"]],
      limit: 20,
      // OperationService,
      // where: { NumCompte: num },
    });
  }
}

module.exports = OperationService;
