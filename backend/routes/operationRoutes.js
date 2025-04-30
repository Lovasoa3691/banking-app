const express = require("express");
const router = express.Router();
const controller = require("../controllers/OperationController");
const CompteController = require("../controllers/CompteController");
const verifyToken = require("../middlewire/middlewire");

// Recuperation
router.get("/retrait/:id", verifyToken, controller.getAllRetrait);
router.get("/pret/:id", verifyToken, controller.getAllPret);
router.get("/virement/:id", verifyToken, controller.getAllVirement);
router.get("/client/:id", verifyToken, controller.getAllOperations);
router.get("/compte", verifyToken, CompteController.getCompteByClient);
router.get("/compte/all", verifyToken, CompteController.getAllCompte);

// Creation
router.post("/compte", verifyToken, CompteController.createCompte);
router.post("/retrait", verifyToken, controller.doRetrait);
router.post("/virement", verifyToken, controller.doVirement);
router.post("/pret", verifyToken, controller.doPret);

// Suppression
router.delete("/historique/:id", controller.deleteHistorique);

module.exports = router;
