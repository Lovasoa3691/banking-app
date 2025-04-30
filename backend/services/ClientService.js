const Utilisateur = require("../models/Utilisateur");

class ClientService {
  static async createClient(data) {
    return Utilisateur.create({
      ...data,
      discriminator: "Client",
    });
  }

  static async getAllClient() {
    return Utilisateur.findAll({
      where: { Discriminator: "Client" },
    });
  }

  static async getClientById(idUt) {
    return Utilisateur.findOne({
      where: { idUt, Discriminator: "Client" },
    });
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

module.exports = ClientService;
