# 🎬 FC Popcorn - Backend API

API REST pour la gestion d'un site web de club de football, incluant la gestion des actualités, des matchs et de l'authentification des utilisateurs.

## 📋 Table des matières

- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Scripts disponibles](#scripts-disponibles)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Base de données](#base-de-données)
- [Production](#production)

## 🛠️ Technologies

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset typé de JavaScript
- **Express.js** - Framework web minimaliste
- **Prisma** - ORM moderne pour PostgreSQL
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification par tokens
- **bcryptjs** - Hash des mots de passe
- **CORS** - Gestion des requêtes cross-origin

## 📦 Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (v14 ou supérieur)
- npm ou yarn

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd back
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer le fichier .env avec vos valeurs
```

4. **Générer le client Prisma**
```bash
npx prisma generate
```

5. **Exécuter les migrations**
```bash
npx prisma migrate dev
```

6. **Lancer le serveur de développement**
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

## ⚙️ Configuration

Créez un fichier `.env` à la racine du projet :

```env
NODE_ENV=development
PORT=3000
FRONT_URL=http://localhost:5173
DATABASE_URL="postgresql://user:password@localhost:5432/database?schema=public"
JWT_SECRET="votre-secret-jwt-sécurisé"
JWT_EXPIRES="7d"
```

### Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NODE_ENV` | Environnement d'exécution | `development` ou `production` |
| `PORT` | Port du serveur | `3000` |
| `FRONT_URL` | URL du frontend (CORS) | `http://localhost:5173` |
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://...` |
| `JWT_SECRET` | Clé secrète pour les tokens JWT | Chaîne aléatoire sécurisée |
| `JWT_EXPIRES` | Durée de validité des tokens | `7d`, `24h`, `30m` |

## 📜 Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur en mode watch avec nodemon

# Build
npm run build        # Compile TypeScript en JavaScript

# Production
npm start            # Lance le serveur compilé
npm run start:prod   # Migrations + lancement en production

# Prisma
npx prisma migrate dev    # Crée et applique une migration
npx prisma studio         # Interface graphique pour la DB
npx prisma generate       # Génère le client Prisma
```

## 🏗️ Architecture

```
src/
├── server.ts           # Point d'entrée de l'application
├── config/             # Configuration de l'app
│   ├── database.ts     # Connexion Prisma
│   └── express.ts      # Configuration Express
├── controllers/        # Gestion des requêtes HTTP
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── news.controller.ts
│   └── match.controller.ts
├── services/           # Logique métier
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── news.service.ts
│   └── match.service.ts
├── routes/             # Définition des endpoints
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── news.routes.ts
│   └── match.routes.ts
├── middlewares/        # Middlewares Express
│   ├── auth.middleware.ts
│   └── errorHandler.ts
└── utils/              # Utilitaires
    └── auth.ts         # Helpers JWT
```

### Pattern MVC + Services

- **Routes** : Définissent les URLs et appliquent les middlewares
- **Controllers** : Gèrent les requêtes/réponses HTTP
- **Services** : Contiennent la logique métier et interagissent avec la DB
- **Middlewares** : Interceptent les requêtes (auth, validation, erreurs)

## 🔌 API Endpoints

### Authentification

```
POST   /api/auth/register    # Créer un compte
POST   /api/auth/login        # Se connecter
GET    /api/auth/me           # Profil utilisateur (protected)
```

### Utilisateurs

```
GET    /api/users             # Liste des utilisateurs (admin)
GET    /api/users/:id         # Détails d'un utilisateur
PUT    /api/users/:id         # Modifier un utilisateur (protected)
DELETE /api/users/:id         # Supprimer un utilisateur (admin)
```

### Actualités

```
GET    /api/news              # Liste des actualités (pagination)
GET    /api/news/:id          # Détails d'une actualité
POST   /api/news              # Créer une actualité (admin)
PUT    /api/news/:id          # Modifier une actualité (admin)
DELETE /api/news/:id          # Supprimer une actualité (admin)
```

### Matchs

```
GET    /api/matches           # Liste des matchs (filtres disponibles)
GET    /api/matches/:id       # Détails d'un match
POST   /api/matches           # Créer un match (admin)
PUT    /api/matches/:id       # Modifier un match (admin)
DELETE /api/matches/:id       # Supprimer un match (admin)
```

### Authentification des requêtes

Pour les routes protégées, ajoutez le header :
```
Authorization: Bearer <votre-token-jwt>
```

## 🗄️ Base de données

### Modèles Prisma

- **User** : Utilisateurs et admins
- **News** : Actualités du club
- **Match** : Matchs à venir et passés

### Enums

- `Role` : `USER`, `ADMIN`
- `NewsCategory` : `TRANSFER`, `MATCH`, `OTHER`
- `MatchCompetition` : `FRIENDLY`, `LEAGUE`, `CUP`, `TOURNAMENT`, `OTHER`
- `StatusCategory` : `SCHEDULED`, `ONGOING`, `COMPLETED`, `POSTPONED`, `CANCELLED`

### Commandes utiles

```bash
# Créer une migration
npx prisma migrate dev --name nom_de_la_migration

# Réinitialiser la DB
npx prisma migrate reset

# Seed (si configuré)
npx prisma db seed

# Ouvrir Prisma Studio
npx prisma studio
```

## 🚀 Production

### Build

```bash
npm run build
```

Génère le dossier `dist/` avec le code compilé.

### Variables d'environnement de production

```env
NODE_ENV=production
PORT=3000
FRONT_URL=https://votre-domaine.com
DATABASE_URL="postgresql://..."
JWT_SECRET="secret-très-sécurisé-en-production"
JWT_EXPIRES="7d"
```

### Déploiement

1. **Build du projet**
```bash
npm run build
```

2. **Lancer les migrations**
```bash
npx prisma migrate deploy
```

3. **Démarrer le serveur**
```bash
npm run start:prod
```

### Avec Docker

Un fichier `docker-compose.yml` est disponible à la racine du projet pour déployer l'application avec PostgreSQL.

```bash
docker-compose up -d
```

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ Authentification JWT
- ✅ Protection CORS configurée
- ✅ Variables sensibles dans `.env` (non versionné)
- ✅ Validation des données entrantes
- ⚠️ En production : utilisez HTTPS et des secrets robustes

## 📝 Licence

ISC

## 👨‍💻 Auteur

Développé dans le cadre du projet DWWM
