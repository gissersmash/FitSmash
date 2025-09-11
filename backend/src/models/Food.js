import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";

export const Food = sequelize.define("Food", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false }, // Nom de l'aliment
  calories: { type: DataTypes.INTEGER, allowNull: false }, // Calories (kcal)
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 }, // Portion
  created_at: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: "foods",
  timestamps: false
});

// Relation User → Food
User.hasMany(Food, { foreignKey: "user_id" });
Food.belongsTo(User, { foreignKey: "user_id" });
