// backend/src/models/HealthEntry.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const HealthEntry = sequelize.define("HealthEntry", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  poids: { type: DataTypes.FLOAT, allowNull: false }, // kg
  sommeil: { type: DataTypes.FLOAT, allowNull: false }, // heures
  activite: { type: DataTypes.FLOAT, allowNull: false }, // minutes
  date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }
});

export default HealthEntry;
