const express = require("express");
const router = express.Router();
const controller = require("../controllers/UtilisateurController");
const verifyToken = require("../middlewire/middlewire");

// Recuperation
router.get("/", verifyToken, controller.getClientById);
router.get("/client", verifyToken, controller.getAllClient);
router.get("/compte", verifyToken, controller.getAllCompte);
router.get("/me", verifyToken, controller.getUserConnected);
router.get("/logout", controller.logout);
router.get("/all", controller.getUserSpecific);
router.get("/client/total", controller.getClientCount);

// Enregistrement
router.post("/", verifyToken, controller.create);
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/client", verifyToken, controller.createClient);

// Modification
router.put("/utilisateur", verifyToken, controller.changePassword);
router.put("/client/:id", verifyToken, controller.updateClient);

// Suppression
router.delete("/client/:id", verifyToken, controller.deleteClient);
router.delete("/utilisateur/:id", verifyToken, controller.deleteAccount);

module.exports = router;
