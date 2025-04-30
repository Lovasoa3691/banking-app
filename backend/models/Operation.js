const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Operation = sequelize.define(
  "Operation",
  {
    NumOp: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Montant: { type: DataTypes.DOUBLE, allowNull: false },
    Motif: { type: DataTypes.STRING, allowNull: true },
    DateOp: { type: DataTypes.DATE, allowNull: false },
    NumDest: { type: DataTypes.STRING, allowNull: true },
    StatusP: { type: DataTypes.STRING, allowNull: true },
    Duree: { type: DataTypes.STRING, allowNull: true },
    Revenu: { type: DataTypes.DOUBLE, allowNull: true },
    Discriminator: { type: DataTypes.STRING, allowNull: false },
    NumCompte: {
      type: DataTypes.STRING,
      references: {
        model: "Compte",
        key: "NumCompte",
      },
    },
  },
  {
    tableName: "Operation",
    timestamps: false,
  }
);

Operation.associate = (models) => {
  Operation.belongsTo(models.Compte, {
    foreignKey: "NumCompte",
    as: "Operations",
  });
};

module.exports = Operation;
