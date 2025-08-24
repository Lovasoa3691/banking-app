const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Utilisateur = sequelize.define(
  "Utilisateur",
  {
    IdUt: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Nom: { type: DataTypes.STRING(20), allowNull: false },
    Prenom: { type: DataTypes.STRING(40), allowNull: false },
    Adresse: { type: DataTypes.STRING(10), allowNull: false },
    Telephone: { type: DataTypes.STRING(20), allowNull: false },
    Cin: { type: DataTypes.STRING(15), allowNull: true },
    Profession: { type: DataTypes.STRING(20), allowNull: true },
    Role: { type: DataTypes.STRING(20), allowNull: true },
    Discriminator: { type: DataTypes.STRING(20), allowNull: false },
  },
  {
    tableName: "Utilisateur",
    timestamps: false,
  }
);

Utilisateur.associate = (models) => {
  Utilisateur.hasMany(models.Compte, {
    foreignKey: "UtilisateurClient",
    as: "Client",
  });
  Utilisateur.hasMany(models.Compte, {
    foreignKey: "UtilisateurAdmin",
    as: "Admin",
  });
  Utilisateur.hasOne(models.Connexion, {
    foreignKey: "UtilisateurId",
    as: "Utilisateur",
  });
};

module.exports = Utilisateur;
