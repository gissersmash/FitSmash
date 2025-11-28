# Étape 1: Utiliser une image Node.js officielle comme base
FROM node:18-alpine

# Étape 2: Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3: Copier package.json et package-lock.json
COPY package*.json ./

# Étape 4: Installer les dépendances
RUN npm install

# Étape 5: Copier le reste du code de l'application
COPY . .

# Étape 6: Exposer le port sur lequel l'application tourne (par exemple 5000)
EXPOSE 4000

# Étape 7: La commande pour démarrer l'application (en utilisant nodemon pour le développement)
CMD [ "npm", "run", "dev" ]
