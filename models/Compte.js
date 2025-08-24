const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Compte = sequelize.define(
  "Compte",
  {
    NumCompte: { type: DataTypes.STRING(20), primaryKey: true },
    Solde: { type: DataTypes.DOUBLE, allowNull: false },
    Pin: { type: DataTypes.STRING(150), allowNull: false },
    DateOuverture: { type: DataTypes.DATE, allowNull: false },
    StatusCompte: { type: DataTypes.STRING(15), allowNull: false },
    Decouvert: { type: DataTypes.DOUBLE, allowNull: true },
    Taux: { type: DataTypes.DOUBLE, allowNull: true },
    Discriminator: { type: DataTypes.STRING(20), allowNull: false },

    UtilisateurClient: {
      type: DataTypes.INTEGER,
      references: {
        model: "Utilisateur",
        key: "IdUt",
      },
    },

    UtilisateurAdmin: {
      type: DataTypes.INTEGER,
      references: {
        model: "Utilisateur",
        key: "IdUt",
      },
    },
  },
  {
    tableName: "Compte",
    timestamps: false,
  }
);

Compte.associate = (models) => {
  Compte.belongsTo(models.Utilisateur, {
    foreignKey: "UtilisateurClient",
    as: "Client",
  });
  Compte.belongsTo(models.Utilisateur, {
    foreignKey: "UtilisateurAdmin",
    as: "Admin",
  });
  Compte.hasMany(models.Operation, {
    foreignKey: "NumCompte",
    as: "Operations",
  });
};

module.exports = Compte;
