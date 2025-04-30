const Compte = require("../models/Compte");
const { Utilisateur } = require("../models");

class CompteService {
  static async createCompte(data) {
    return Compte.create({
      ...data,
    });
  }

  static async getAllCompte() {
    return Compte.findAll({
      include: [
        {
          model: Utilisateur, // ou models.Compte si via index.js
          as: "Client", // doit correspondre à l'alias utilisé dans `belongsTo`
        },
      ],
    });
  }

  static async getCompteById(numCompte) {
    return Compte.findOne({
      where: { numCompte },
    });
  }

  static async updateCompte(numCompte, updatedData) {
    return Compte.update(updatedData, {
      where: { numCompte },
    });
  }

  static async deleteCompte(idUt) {
    return Compte.destroy({
      where: { idUt },
    });
  }

  static async blockCompte(num, data) {
    return Compte.update(data, {
      where: { num },
    });
  }

  static async getCompteCourantByClient() {
    return Compte.findAll({
      where: { Discriminator: "Courant" },
      include: [
        {
          model: Utilisateur, // ou models.Compte si via index.js
          as: "Client", // doit correspondre à l'alias utilisé dans `belongsTo`
        },
      ],
    });
  }

  static async getCompteEpargneByClient() {
    return Compte.findAll({
      where: { Discriminator: "Epargne" },
      include: [
        {
          model: Utilisateur, // ou models.Compte si via index.js
          as: "Client", // doit correspondre à l'alias utilisé dans `belongsTo`
        },
      ],
    });
  }
}

module.exports = CompteService;
