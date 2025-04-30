const { Connexion, Compte } = require("../models");
const Utilisateur = require("../models/Utilisateur");
const bcrypt = require("bcrypt");

class UtilisateurService {
  static async createUser(data) {
    return Connexion.create({
      ...data,
    });
  }

  static async createClient(data) {
    return Utilisateur.create({
      ...data,
      Discriminator: "Client",
    });
  }

  static async deleteClient(idUt) {
    return Utilisateur.destroy({
      where: { idUt, Discriminator: "Client" },
    });
  }

  static async updateClient(idUt, updatedData) {
    return Utilisateur.update(updatedData, {
      where: { idUt, Discriminator: "Client" },
    });
  }

  static async getUser(mail, pass) {
    const user = await Connexion.findOne({
      where: { Email: mail },
      include: [
        {
          model: Utilisateur,
          as: "Utilisateur",
        },
      ],
    });

    if (user && (await bcrypt.compare(pass, user.Mdp))) {
      return user;
    }
    return null;
  }

  static async getAllClient() {
    return await Utilisateur.findAll({
      where: { Discriminator: "Client" },
    });
  }

  static async getAllCompte() {
    return await Compte.findAll({
      include: [
        {
          model: Utilisateur,
          as: "Client",
        },
      ],
    });
  }

  static async getClientById(idUt) {
    const user = await Compte.findOne({
      where: { UtilisateurClient: idUt },
      // include: [
      //   {
      //     model: Compte,
      //     as: "Client",
      //   },
      // ],
    });

    if (user) {
      return user;
    }
    return null;
  }

  static async updateClient(idUt, updatedData) {
    return Utilisateur.update(updatedData, {
      where: { idUt, Discriminator: "Client" },
    });
  }

  static async deleteClient(idUt) {
    return Utilisateur.destroy({
      where: { idUt, Discriminator: "Client" },
    });
  }
}

module.exports = UtilisateurService;
