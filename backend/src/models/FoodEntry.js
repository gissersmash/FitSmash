import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const FoodEntry = sequelize.define("FoodEntry", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  food_id: { type: DataTypes.STRING, allowNull: true }, // ID de l'aliment externe

  // Nutrition
  name: { type: DataTypes.STRING, allowNull: true }, // ex: "Poulet"
  calories: { type: DataTypes.INTEGER, allowNull: true },
  proteins: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0 }, // grammes
  carbs: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0 }, // grammes
  fats: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0 }, // grammes
  quantity: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 100 }, // grammes
  image: { type: DataTypes.STRING, allowNull: true }, // URL de l'image
  date: { type: DataTypes.DATEONLY, allowNull: true, defaultValue: DataTypes.NOW }, // Date de consommation

  // Suivi santé
  poids: { type: DataTypes.FLOAT, allowNull: true },     // kg
  sommeil: { type: DataTypes.FLOAT, allowNull: true },   // heures
  activite: { type: DataTypes.FLOAT, allowNull: true },  // minutes

  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  updatedAt: false
});

export default FoodEntry;
