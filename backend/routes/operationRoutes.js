const express = require("express");
const router = express.Router();
const controller = require("../controllers/OperationController");
const CompteController = require("../controllers/CompteController");
const verifyToken = require("../middlewire/middlewire");

// Recuperation
router.get("/retrait/:id", verifyToken, controller.getAllRetrait);
router.get("/pret/:id", verifyToken, controller.getAllPret);
router.get("/pret", verifyToken, controller.getAllPretData);
router.get("/virement/:id", verifyToken, controller.getAllVirement);
router.get("/client/:id", verifyToken, controller.getAllOperations);
router.get("/client/operations/:id", controller.getTotalOperationsByClient);
router.get("/compte", verifyToken, CompteController.getCompteByClient);
router.get("/compte/all", verifyToken, CompteController.getAllCompte);
router.get("/compte/total", CompteController.getCompteCount);
router.get("/current/total", CompteController.getTotalCurrent);
router.get("/total", verifyToken, controller.getTotalOperations);
router.get("/current", verifyToken, controller.getCurrentOperations);
router.get("/operation/:id", controller.findOneOperation);

// Creation
router.post("/compte", verifyToken, CompteController.createCompte);
router.post("/retrait", verifyToken, controller.doRetrait);
router.post("/virement", verifyToken, controller.doVirement);
router.post("/pret", verifyToken, controller.doPret);
router.post("/check", CompteController.checkExistingCompte);

router.put("/pret/:id", verifyToken, controller.updateStatus);
router.put("/compte/:id", verifyToken, CompteController.updateCompte);

// Suppression
router.delete("/historique/:id", verifyToken, controller.deleteHistorique);
router.delete("/compte/:id", verifyToken, CompteController.deleteCompte);

module.exports = router;
