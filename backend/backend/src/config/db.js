// Importation du module Sequelize pour gérer la connexion à la base de données
import { Sequelize } from 'sequelize';

// Importation et configuration de dotenv pour utiliser les variables d'environnement du fichier .env
import dotenv from 'dotenv';
dotenv.config();

// Création de l'instance Sequelize avec les paramètres récupérés du fichier .env
export const sequelize = new Sequelize(
    process.env.DB_NAME, // Nom de la base de données
    process.env.DB_USER, // Utilisateur MySQL
    process.env.DB_PASS, // Mot de passe MySQL
    {
        host: process.env.DB_HOST, // Adresse du serveur MySQL
        port: process.env.DB_PORT, // Port MySQL
        dialect: 'mysql', // Type de base de données
        logging: false, // Désactive les logs SQL dans la console
    }
);

// Fonction pour tester la connexion à la base de données
export async function testDBConnection() {
    try {
        await sequelize.authenticate(); // Vérifie la connexion
        console.log('Connexion à la base de données réussie.');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données :', error);
    }
}