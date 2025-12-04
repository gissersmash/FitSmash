// Modèle utilisateur
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';    

export const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.TEXT, allowNull: true }, // Pour stocker l'URL ou Base64 de l'avatar
}, {
    tableName: 'users',
    timestamps: true,
});
