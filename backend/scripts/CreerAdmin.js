// scripts/createAdmin.js
const bcrypt = require("bcrypt");
const { sequelize, Utilisateur, Connexion } = require("../models");

async function CreerAdmin() {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie.");

    const info = await Utilisateur.create({
      Nom: "ANDRIANARISOA",
      Prenom: "Lovaniaina Sarah",
      Adresse: "Mahazengy",
      Telephone: "+261347448102",
      Role: "Administrateur",
      Discriminator: "Admin",
    });

    const hashedPassword = await bcrypt.hash("sarah", 10);
    const idUtilisateur = info.IdUt;

    await Connexion.create({
      Email: "lovaniainasarah@gmail.com",
      Mdp: hashedPassword,
      UtilisateurId: idUtilisateur,
    });

    console.log("Utilisateur créé avec succès !");
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur :", err.message);
  } finally {
    await sequelize.close();
    console.log("Connexion fermée.");
  }
}

CreerAdmin();
