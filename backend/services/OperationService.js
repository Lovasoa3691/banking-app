const { Compte, Operation } = require("../models");

class OperationService {
  static async createCompte(data) {
    return Compte.create({
      ...data,
    });
  }

  static async doWithdraw(data) {
    return Operation.create({
      ...data,
    });
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
          model: Compte, // ou models.Compte si via index.js
          as: "Compte", // doit correspondre à l'alias utilisé dans `belongsTo`
        },
      ],
    });
  }

  static async getAllExchange(num) {
    return Operation.findAll({
      where: { NumCompte: num, Discriminator: "Pret" },
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
      where: { NumCompte: num },
    });
  }
}

module.exports = OperationService;
