# README

Ce projet est divisé en deux parties : le backend et le frontend.

## Backend

### Prérequis
- Node.js
- npm
- Docker (pour la base de données)

### Installation
1. Clonez le dépôt : `git clone <url-du-dépôt>`
2. Accédez au dossier backend : `cd back`
3. Installez les dépendances : `npm install`
4. Configurez votre fichier `.env` :
   - Copiez le fichier d'exemple : `cp .env.example .env`
   - Modifiez les valeurs selon votre environnement

### Lancer le projet

### Backend

1. Démarrez la base de données avec Docker : `docker compose up -d`
2. Exécutez les migrations : `npx prisma migrate dev`
3. Peuplez la base de données avec des données initiales : `npm run db-seed`
4. Lancez le serveur : `npm run dev`
5. (Optionnel) Ouvrez Prisma Studio pour visualiser/gérer la base de données : `npx prisma studio`

## Frontend

### Prérequis
- Node.js
- npm

### Installation
1. Accédez au dossier frontend : `cd front`
2. Installez les dépendances : `npm install`
3. Configurez votre fichier `.env` :
   - Copiez le fichier d'exemple : `cp .env.example .env`
   - Modifiez les valeurs selon votre environnement

### Lancer le projet

### Frontend

1. Accédez au dossier frontend : `cd front`
2. Lancez le serveur de développement : `npm run dev`

---

### Remarques
- Assurez-vous que le backend est en cours d'exécution avant d'accéder au frontend.
- Modifiez les fichiers de configuration selon vos besoins.