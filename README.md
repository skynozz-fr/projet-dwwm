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

## Déploiement gratuit (Render)

Le repo contient un blueprint `render.yaml` pour déployer:
- `fc-popcorn-api` (Node/Express + Prisma) en service web gratuit
- `fc-popcorn-front` (Vite) en site statique gratuit
- `fc-popcorn-db` (PostgreSQL) en base gratuite

### Étapes
1. Poussez la branche sur GitHub.
2. Sur Render: `New` -> `Blueprint` -> connectez le repo.
3. Lancez le déploiement.
4. Quand les services sont créés, définissez les variables:
   - Sur `fc-popcorn-api`: `FRONT_URL` = URL publique du front Render
   - Sur `fc-popcorn-front`: `VITE_API_URL` = URL publique de l'API Render
5. Redéployez le front après avoir défini `VITE_API_URL`.

### Notes
- Les offres gratuites Render peuvent se mettre en veille (cold start).
- Le backend applique automatiquement les migrations Prisma au démarrage.
