const { Connexion } = require("../models");
const Utilisateur = require("../models/Utilisateur");
const AdminService = require("../services/AdminService");
const ClientService = require("../services/ClientService");
const UtilisateurService = require("../services/UtilisateurService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getAllClient = async (req, res) => {
  try {
    const data = await UtilisateurService.getAllClient();
    if (!data)
      return res.status(404).json({ message: "Aucun utilisateur trouvé" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCompte = async (req, res) => {
  try {
    const data = await UtilisateurService.getAllCompte();
    if (!data) return res.status(404).json({ message: "Aucun compte trouvé" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (!utilisateur)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(utilisateur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = {
      IdUt: null,
      Nom: "FENONANTENAIKO",
      Prenom: "Lovasoa Juliannot",
      Adresse: "Ampitakely",
      Telephone: "+2613516063",
      Role: "Administrator",
      Discriminator: "Admin",
    };

    const newUser = await AdminService.createAdmin(data);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createClient = async (req, res) => {
  const { nom, prenom, adresse, telephone, cin, profession } = req.body;
  try {
    const data = {
      IdUt: null,
      Nom: nom,
      Prenom: prenom,
      Adresse: adresse,
      Telephone: telephone,
      Cin: cin,
      Profession: profession,
    };

    const newClient = await UtilisateurService.createClient(data);
    return res.status(201).json({
      success: true,
      message: "Client créé avec succès",
      client: newClient,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedClient = await UtilisateurService.deleteClient(id);
    if (!deletedClient) {
      return res
        .status(404)
        .json({ success: false, message: "Client non trouvé" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Client supprimé avec succès" });
  } catch (error) {
    console.error(error);
  }
};

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, adresse, telephone, cin, profession } = req.body;
  try {
    const updatedClient = await UtilisateurService.updateClient(id, {
      Nom: nom,
      Prenom: prenom,
      Adresse: adresse,
      Telephone: telephone,
      Cin: cin,
      Profession: profession,
    });
    if (!updatedClient) {
      return res
        .status(404)
        .json({ success: false, message: "Client non trouvé" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Client mis à jour avec succès" });
  } catch (error) {
    console.error(error);
  }
};

exports.changePassword = async (req, res) => {
  const { email, newPass } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPass, 10);
    const updatedUser = await UtilisateurService.changePassword(
      email,
      hashedPassword
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du mot de passe" });
  }
};

exports.deleteAccount = async (req, res) => {
  const { email } = req.params;
  try {
    const deletedUser = await UtilisateurService.deleteAccount(email);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });
    }
    res
      .status(200)
      .json({ success: true, message: "Compte supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du compte" });
  }
};

exports.getUserConnected = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getClientCount = async (req, res) => {
  try {
    const count = await UtilisateurService.getClientCount();
    if (!count) {
      return res
        .status(404)
        .json({ success: false, message: "Aucun utilisateur trouvé" });
    }
    return res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getUserSpecific = async (req, res) => {
  try {
    const user = await UtilisateurService.getUserSpecific();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Aucun utilisateur trouvé" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy();
  res.json({ message: "Déconnexion réussie" });
};

exports.getClientById = async (req, res) => {
  const { id } = req.user;
  try {
    const Client = await UtilisateurService.getClientById(id);

    if (Client) {
      res.status(200).json({
        success: true,
        client: Client,
      });
    } else {
      return res.status(401).json({ message: "Informations introuvables" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Erreur lors de la recuoeration des informations",
    });
  }
};

exports.register = async (req, res) => {
  const { email, phone, password } = req.body;
  if (!email || !phone || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }
  try {
    const utilisateur = await UtilisateurService.checkUser(phone);

    if (!utilisateur) {
      return res.status(404).json({
        message:
          "Utilisateur non trouvé. Veuillez d'abord vous enregistrer à l'agence.",
      });
    }

    const existingConnexion = await Connexion.findOne({
      where: { UtilisateurId: utilisateur.IdUt },
    });

    if (existingConnexion) {
      return res
        .status(400)
        .json({ message: "Un compte existe déjà pour cet utilisateur." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      IdCon: null,
      Email: email,
      Mdp: hashedPassword,
      UtilisateurId: utilisateur.IdUt,
    };

    const newUser = await UtilisateurService.createUser(user);
    res
      .status(201)
      .json({ message: "Votre compte a ete créé avec succès", user: newUser });
  } catch (error) {
    res.status(500).json({
      text: "Erreur s'est produit lors de l'inscription",
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { Email, Mdp } = req.body;
  try {
    const user = await UtilisateurService.getUser(Email, Mdp);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email ou mot de passe incorrect." });
    }

    const payload = {
      id: user.Utilisateur.IdUt,
      nom: user.Utilisateur.Nom,
      prenom: user.Utilisateur.Prenom,
      role: user.Utilisateur.Discriminator,
      email: user.Email,
      contact: user.Utilisateur.Telephone,
    };

    const token = jwt.sign(payload, "sfbmnznncdsafbnsdmnmbncchvbhadvbfhjsd", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      token,
      user: payload,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur. Veuillez réessayer plus tard." });
  }
};
