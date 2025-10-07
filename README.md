# Application de Gestion de Comptes Bancaires

Cette application permet la **gestion complète de comptes bancaires** avec deux espaces distincts : **Administrateur** et **Client**.  
Elle a été développée pour simplifier la gestion des comptes, des prêts et des transactions bancaires en ligne.

---

## Fonctionnalités principales

### Espace Administrateur
L’administrateur dispose d’un tableau de bord complet lui permettant de :
- 🔹 Créer, modifier et supprimer des comptes bancaires  
- 🔹 Gérer les **demandes de prêt** reçues des clients (validation, rejet, etc.)  
- 🔹 Consulter les **historiques de transactions** de chaque compte (retraits, dépôts, virements, transferts)

### Espace Client
Chaque client dispose d’un accès sécurisé pour :
- Effectuer des **opérations bancaires** :
  - Retrait  
  - Dépôt  
  - Virement / Transfert vers d’autres comptes  
- Faire une **demande de prêt**  
- Consulter le **solde** et l’historique de ses transactions

---

## Technologies utilisées

| Catégorie | Technologies |
|------------|--------------|
| **Frontend** | React.js |
| **Backend** | Node.js/Express.js |
| **Base de données** | MySQL |
| **Authentification** | JWT / Sessions |
| **Autres outils** | Axios |

---

## Installation et exécution

1. **Cloner le dépôt**
 ```bash
 git clone https://github.com/Lovasoa3691>/banking-app.git
 cd banking-app
 ```

2. **Installer les dependances
```bash
  npm install
  cd backend
  npm install
  }
```

3. **Configurer la base de données
 ```bash
 const sequelize = new Sequelize("banque", "ton_nom_utilisateur", "ton_mot_de_passe", {
 host: "localhost",
 dialect: "mysql",
 logging: false,
 })
```

4. **Migrations
```bash
  cd backend
  node init-db.js
```

5. **Creer un compte admin pour test
```bash
  node scripts/CreerAdmin.js
```

6. **Lancer le server
```bash
  cd backend
  npm run dev

  # frontend
  cd banking-app
  npm run dev
```





