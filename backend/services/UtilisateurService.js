const { Connexion, Compte } = require("../models");
const Utilisateur = require("../models/Utilisateur");
const bcrypt = require("bcrypt");
const { Sequelize, Op, where } = require("sequelize");

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
      where: { IdUt: idUt, Discriminator: "Client" },
    });
  }

  static async updateClient(idUt, updatedData) {
    return Utilisateur.update(updatedData, {
      where: { idUt, Discriminator: "Client" },
    });
  }

  static async getUserSpecific() {
    return Utilisateur.findOne({
      where: {
        Discriminator: "Client",
        IdUt: {
          [Op.notIn]: Sequelize.literal(
            `(SELECT UtilisateurClient FROM Compte WHERE UtilisateurClient IS NOT NULL)`
          ),
        },
      },
      order: [["IdUt", "DESC"]],
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

  static async checkUser(phone) {
    const user = await Utilisateur.findOne({
      where: { Telephone: phone },
    });

    if (user) {
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

  static async deleteClient(id) {
    const client = await Utilisateur.findOne({
      where: { IdUt: id },
      include: [
        {
          model: Compte,
          as: "Client",
        },
      ],
    });

    if (!client) {
      throw new Error("Utilisateur introuvable");
    }

    const compte = client.IdUt;

    await compte.destroy();

    if (client) {
      await client.destroy();
    }

    return true;
  }

  // static async blockClient(idUt, updatedData) {
  //   return Utilisateur.update(updatedData, {
  //     where: { idUt, Discriminator: "Client" },
  //   });
  // }

  static async changePassword(email, newPassword) {
    return Connexion.update(
      { Mdp: newPassword },
      {
        where: { Email: email },
      }
    );
  }

  static async deleteAccount(mail) {
    return Connexion.destroy({
      where: { Email: mail },
    });
  }

  static async getClientCount() {
    return Utilisateur.count({
      where: { Discriminator: "Client" },
    });
  }
}

module.exports = UtilisateurService;
