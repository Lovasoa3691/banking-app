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
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedClient = await ClientService.deleteClient(id);
    if (!deletedClient) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    res.status(200).json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error(error);
  }
};

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { Nom, Prenom, Adresse, Telephone, Cin, Profession } = req.body;
  try {
    const updatedClient = await ClientService.updateClient(id, {
      Nom,
      Prenom,
      Adresse,
      Telephone,
      Cin,
      Profession,
    });
    if (!updatedClient) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    res.status(200).json({ message: "Client mis à jour avec succès" });
  } catch (error) {
    console.error(error);
  }
};

exports.register = async (req, res) => {
  try {
    const mdp = "lova";
    const hashedPass = await bcrypt.hash(mdp, 10);

    const user = {
      IdCon: null,
      Email: "fenonantenaikolovasoa@gmail.com",
      Mdp: hashedPass,
      UtilisateurId: 1,
    };

    const newUser = await UtilisateurService.createUser(user);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserConnected = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
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

exports.login = async (req, res) => {
  const { Email, Mdp } = req.body;
  try {
    const user = await UtilisateurService.getUser(Email, Mdp);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });
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

    res.status(200).json({
      success: true,
      token,
      user: payload,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur serveur. Veuillez réessayer plus tard." });
  }
};
