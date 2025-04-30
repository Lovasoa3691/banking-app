const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Utilisateur = sequelize.define(
  "Utilisateur",
  {
    IdUt: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Nom: { type: DataTypes.STRING, allowNull: false },
    Prenom: { type: DataTypes.STRING, allowNull: false },
    Adresse: { type: DataTypes.STRING, allowNull: false },
    Telephone: { type: DataTypes.STRING, allowNull: false },
    Cin: { type: DataTypes.STRING, allowNull: true },
    Profession: { type: DataTypes.STRING, allowNull: true },
    Role: { type: DataTypes.STRING, allowNull: true },
    Discriminator: { type: DataTypes.STRING, allowNull: false },
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
