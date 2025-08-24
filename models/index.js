
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Utilisateur = require("./Utilisateur");
const Operation = require("./Operation");
const Compte = require("./Compte");
const Connexion = require("./Connexion");

const models = {
  // sequelize,
  Utilisateur,
  Operation,
  Connexion,
  Compte,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
