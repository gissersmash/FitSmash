// backend/src/models/Objective.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";

export const Objective = sequelize.define("Objective", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  target_value: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  unit: { type: DataTypes.STRING(50), allowNull: true, defaultValue: "" },
  current_value: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
  deadline: { type: DataTypes.DATEONLY, allowNull: true },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: "objectives",
  timestamps: false
});

User.hasMany(Objective, { foreignKey: "user_id" });
Objective.belongsTo(User, { foreignKey: "user_id" });
