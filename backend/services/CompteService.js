const Compte = require("../models/Compte");
const UtilisateurModel = require("../models/Utilisateur");
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
          model: Utilisateur,
          as: "Client",
        },
      ],
    });
  }

  static async findByNumCompte(numCompte) {
    const compte = await Compte.findOne({ where: { NumCompte: numCompte } });
    return compte;
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

  static async deleteCompte(id) {
    const compte = await Compte.findOne({
      where: { NumCompte: id },
      include: [
        {
          model: Utilisateur,
          as: "Client",
        },
      ],
    });

    if (!compte) {
      throw new Error("Compte introuvable");
    }

    const client = compte.Client;

    await compte.destroy();

    if (client) {
      const autresComptes = await Compte.findAll({
        where: {
          UtilisateurClient: client.IdUt,
        },
      });

      if (autresComptes.length === 0) {
        await client.destroy();
      }
    }

    // if (client) {
    //   await client.destroy();
    // }

    return true;
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
          model: Utilisateur,
          as: "Client",
        },
      ],
    });
  }

  static async getCompteEpargneByClient() {
    return Compte.findAll({
      where: { Discriminator: "Epargne" },
      include: [
        {
          model: Utilisateur,
          as: "Client",
        },
      ],
    });
  }

  static async getCompteCount() {
    return await Compte.count();
  }

  static async getTotalCurrent() {
    return await Compte.sum("Solde");
  }
}

module.exports = CompteService;
