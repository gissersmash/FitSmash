// backend/src/models/HealthEntry.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const HealthEntry = sequelize.define("HealthEntry", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT, // poids en kg
    allowNull: false,
  },
  sleep: {
    type: DataTypes.FLOAT, // heures de sommeil
    allowNull: false,
  },
  activity: {
    type: DataTypes.FLOAT, // minutes d'activité
    allowNull: true, // Maintenant optionnel
    defaultValue: 0,
  },
  activity_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE, // date de la saisie
    allowNull: false,
  },
}, {
  tableName: "healthentries", 
  timestamps: true, // Sequelize gère createdAt et updatedAt
});

export default HealthEntry;
