# 2. Architecture et Configuration du Projet

## 2.1 Structure du Projet

### Architecture Backend

```
backend/
├── config/
│   └── db.js                    # Configuration Sequelize et connexion MySQL
├── src/
│   ├── controllers/             # Logique métier des routes
│   │   ├── auth.controller.js   # Authentification (register, login)
│   │   ├── food.controller.js   # Gestion des aliments
│   │   ├── foodEntry.controller.js # Entrées alimentaires quotidiennes
│   │   ├── goal.controller.js   # Objectifs nutritionnels
│   │   └── health.controller.js # Données de santé (poids, sommeil, activité)
│   ├── middlewares/
│   │   └── auth.js              # Middleware JWT pour protéger les routes
│   ├── models/                  # Modèles Sequelize (ORM)
│   │   ├── User.js              # Utilisateurs
│   │   ├── Food.js              # Aliments (personnels et publics)
│   │   ├── FoodEntry.js         # Entrées alimentaires
│   │   ├── HealthEntry.js       # Données santé quotidiennes
│   │   └── Goal.js              # Objectifs utilisateur
│   ├── routes/                  # Définition des endpoints API
│   │   ├── auth.routes.js       # Routes d'authentification
│   │   ├── food.routes.js       # Routes aliments
│   │   ├── foodEntries.js       # Routes entrées alimentaires
│   │   ├── goal.routes.js       # Routes objectifs
│   │   └── health.routes.js     # Routes données santé
│   ├── seeds/
│   │   └── initFoods.js         # Script d'initialisation des aliments de base
│   └── server.js                # Point d'entrée de l'application
├── .env                         # Variables d'environnement
├── .gitignore                   # Fichiers ignorés par Git
├── docker-compose.yml           # Configuration Docker Compose
├── Dockerfile                   # Image Docker backend
└── package.json                 # Dépendances et scripts npm
```

### Stack Technique

#### Backend
- **Node.js** v18+ (environnement d'exécution JavaScript)
- **Express.js** v5.1 (framework web minimaliste)
- **Sequelize** v6.37 (ORM pour MySQL)
- **MySQL** v8.0 (base de données relationnelle)
- **JWT** (jsonwebtoken v9.0) - Authentification par token
- **bcryptjs** v3.0 - Hachage de mots de passe
- **dotenv** v17.2 - Gestion des variables d'environnement
- **CORS** v2.8 - Gestion des requêtes cross-origin
- **axios** v1.12 - Client HTTP pour API externes (Open Food Facts)

#### Développement
- **Nodemon** v3.1 - Hot reload automatique
- **Docker** & **Docker Compose** - Conteneurisation
- **Git** & **GitHub** - Gestion de versions

### Architecture des Données

#### Base de données MySQL : `sante-app`

**Tables principales :**

1. **`users`** - Comptes utilisateurs
   ```sql
   id, username, email, password, createdAt, updatedAt
   ```

2. **`foods`** - Catalogue d'aliments
   ```sql
   id, user_id (nullable), name, calories, quantity, image_url, created_at
   ```
   - `user_id = NULL` → aliments publics (accessibles à tous)
   - `user_id = <id>` → aliments personnels d'un utilisateur

3. **`foodentries`** - Journal alimentaire quotidien
   ```sql
   id, user_id, food_id, name, calories, image, date, createdAt
   ```

4. **`healthentries`** - Données de santé quotidiennes
   ```sql
   id, user_id, weight, sleep, activity, activity_type, date, createdAt, updatedAt
   ```

5. **`goals`** - Objectifs nutritionnels
   ```sql
   id, user_id, type (Calories, Protéines, Glucides, Lipides), value
   ```

### Flux de Données

```
Client (React) 
    ↓ HTTP/REST
Backend Express
    ↓ Sequelize ORM
MySQL Database
```

**Authentification :**
```
1. POST /api/auth/register → Création compte (password hashed)
2. POST /api/auth/login → JWT token
3. Toutes routes protégées → Header: Authorization: Bearer <token>
```

### Architecture API REST

**Endpoints principaux :**

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/api/auth/register` | Créer un compte | ❌ |
| POST | `/api/auth/login` | Se connecter | ❌ |
| GET | `/api/foods` | Lister aliments (perso + publics) | ✅ |
| GET | `/api/foods/all` | Lister tous les aliments | ❌ |
| POST | `/api/foods` | Ajouter un aliment | ✅ |
| PUT | `/api/foods/:id` | Modifier un aliment | ✅ |
| DELETE | `/api/foods/:id` | Supprimer un aliment | ✅ |
| GET | `/api/food-entries` | Lister entrées alimentaires | ✅ |
| POST | `/api/food-entries` | Ajouter une entrée | ✅ |
| DELETE | `/api/food-entries/:id` | Supprimer une entrée | ✅ |
| GET | `/api/health` | Lister données santé | ✅ |
| POST | `/api/health` | Ajouter données santé | ✅ |
| DELETE | `/api/health/:id` | Supprimer données santé | ✅ |
| GET | `/api/goals` | Lister objectifs | ✅ |
| POST | `/api/goals` | Créer/Mettre à jour objectifs | ✅ |

---

## 2.2 Configuration de l'Environnement de Développement

### Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** >= 20.10 (optionnel, recommandé)
- **Docker Compose** >= 2.0 (optionnel)
- **MySQL** 8.0 (si exécution locale sans Docker)
- **Git**

### Installation Locale (sans Docker)

#### 1. Cloner le repository
```bash
git clone https://github.com/gissersmash/FitSmash.git
cd FitSmash/backend
```

#### 2. Installer les dépendances
```bash
npm install
```

#### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du backend :

```env
# Base de données (local)
DB_HOST=localhost
DB_USER=root
DB_PASS=votre_mot_de_passe
DB_NAME=sante-app
DB_PORT=3306

# Serveur
PORT=4000
CORS_ORIGIN=http://localhost:3000

# JWT Secret (générer une clé aléatoire sécurisée)
JWT_SECRET=votre_secret_jwt_aleatoire_securise

# MySQL Root Password (pour scripts)
MYSQL_ROOT_PASSWORD=votre_mot_de_passe
```

#### 4. Créer la base de données MySQL

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE `sante-app` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
EXIT;
```

#### 5. Initialiser les aliments de base

```bash
npm run seed:foods
```

#### 6. Lancer le serveur en mode développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:4000`

---

### Installation avec Docker (Recommandé)

#### 1. Cloner le repository
```bash
git clone https://github.com/gissersmash/FitSmash.git
cd FitSmash/backend
```

#### 2. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du backend :

```env
# Base de données (Docker)
DB_HOST=db
DB_USER=sante_user
DB_PASS=1234
DB_NAME=sante-app
DB_PORT=3306

# Serveur
PORT=4000
CORS_ORIGIN=http://localhost:3000

# JWT Secret
JWT_SECRET=9438077610

# MySQL Root Password
MYSQL_ROOT_PASSWORD=1234
```

#### 3. Lancer les conteneurs Docker

```bash
docker compose up -d --build
```

Cela va :
- Créer un conteneur MySQL avec la base `sante-app`
- Créer un conteneur Node.js avec le backend
- Synchroniser automatiquement les modèles Sequelize
- Exposer le backend sur `http://localhost:4000`

#### 4. Initialiser les aliments de base

```bash
docker exec sante_app_backend npm run seed:foods
```

#### 5. Vérifier le statut

```bash
# Voir les logs du backend
docker logs sante_app_backend

# Voir les logs de MySQL
docker logs sante_app_mysql

# Vérifier que les conteneurs tournent
docker ps
```

#### 6. Arrêter les conteneurs

```bash
docker compose down
```

#### 7. Supprimer les volumes (réinitialisation complète)

```bash
docker compose down -v
```

---

### Configuration Docker

#### Dockerfile

Le backend utilise une image Node.js Alpine (légère) :

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
```

#### docker-compose.yml

Configuration multi-conteneurs (backend + MySQL) :

```yaml
services:
  backend:
    build: .
    container_name: sante_app_backend
    ports:
      - "4000:4000"
    volumes:
      - ./src:/app/src  # Hot reload
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: mysql:8.0
    container_name: sante_app_mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASS}
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -u root --password=$$MYSQL_ROOT_PASSWORD"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  db_data:
```

---

### Scripts NPM Disponibles

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",           // Démarre le serveur en mode dev
    "seed:foods": "node src/seeds/initFoods.js" // Initialise les aliments
  }
}
```

---

### Tester l'API

#### Avec cURL

```bash
# Tester la route publique
curl http://localhost:4000/api/foods/all

# Créer un compte
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Se connecter
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Lister les aliments (avec token)
curl http://localhost:4000/api/foods \
  -H "Authorization: Bearer <votre_token_jwt>"
```

#### Avec Postman ou Insomnia

1. Importer la collection d'endpoints
2. Configurer la variable d'environnement `baseURL = http://localhost:4000`
3. Tester les routes protégées avec le token JWT

---

### Dépannage

#### Erreur de connexion MySQL

```bash
# Vérifier que MySQL tourne
docker ps | grep mysql

# Voir les logs MySQL
docker logs sante_app_mysql

# Tester la connexion
docker exec -it sante_app_mysql mysql -u root -p
```

#### Le backend ne démarre pas

```bash
# Vérifier les logs
docker logs sante_app_backend

# Vérifier que le .env est bien chargé
docker exec sante_app_backend printenv | grep DB_
```

#### Hot reload ne fonctionne pas

- Vérifier que le volume `./src:/app/src` est bien monté dans `docker-compose.yml`
- Redémarrer le conteneur : `docker compose restart backend`

---

### Variables d'Environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `DB_HOST` | Hôte MySQL (`localhost` ou `db` pour Docker) | `db` |
| `DB_USER` | Utilisateur MySQL | `sante_user` |
| `DB_PASS` | Mot de passe MySQL | `1234` |
| `DB_NAME` | Nom de la base de données | `sante-app` |
| `DB_PORT` | Port MySQL | `3306` |
| `PORT` | Port du serveur Express | `4000` |
| `CORS_ORIGIN` | Origine autorisée pour CORS | `http://localhost:3000` |
| `JWT_SECRET` | Clé secrète pour signer les JWT | (aléatoire) |
| `MYSQL_ROOT_PASSWORD` | Mot de passe root MySQL | `1234` |

---

**Prochaine section :** [3. Modèles de données et schéma de base de données](./03-modeles-donnees.md)
