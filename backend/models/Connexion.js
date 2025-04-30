const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Connexion = sequelize.define(
  "Connexion",
  {
    IdCon: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Email: { type: DataTypes.STRING, allowNull: false },
    Mdp: { type: DataTypes.STRING, allowNull: false },
    UtilisateurId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Utilisateur",
        key: "IdUt",
      },
    },
  },
  {
    tableName: "Connexion",
    timestamps: false,
  }
);

Connexion.associate = (models) => {
  Connexion.belongsTo(models.Utilisateur, {
    foreignKey: "UtilisateurId",
    as: "Utilisateur",
  });
};

module.exports = Connexion;
