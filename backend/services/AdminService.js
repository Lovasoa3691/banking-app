const Utilisateur = require("../models/Utilisateur");

class AdminService {
  static async createAdmin(data) {
    return Utilisateur.create({
      ...data,
      discriminator: "Admin",
    });
  }

  static async getAllAdmins() {
    return Utilisateur.findAll({
      where: { Discriminator: "Admin" },
    });
  }

  static async getAdminById(idUt) {
    return Utilisateur.findOne({
      where: { idUt, Discriminator: "Admin" },
    });
  }

  static async updateAdmin(idUt, updatedData) {
    return Utilisateur.update(updatedData, {
      where: { idUt, Discriminator: "Admin" },
    });
  }

  static async deleteAdmin(idUt) {
    return Utilisateur.destroy({
      where: { idUt, Discriminator: "Admin" },
    });
  }
}

module.exports = AdminService;
