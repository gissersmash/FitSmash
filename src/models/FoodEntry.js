import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const FoodEntry = sequelize.define("FoodEntry", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },

  // Nutrition
  name: { type: DataTypes.STRING, allowNull: true }, // ex: "Poulet"
  calories: { type: DataTypes.INTEGER, allowNull: true },

  // Suivi santé
  poids: { type: DataTypes.FLOAT, allowNull: true },     // kg
  sommeil: { type: DataTypes.FLOAT, allowNull: true },   // heures
  activite: { type: DataTypes.FLOAT, allowNull: true },  // minutes

  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  updatedAt: false
});

export default FoodEntry;
