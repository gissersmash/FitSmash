import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";

export const HealthData = sequelize.define("HealthData", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  weight: { type: DataTypes.DECIMAL(5,2) },
  sleep_hours: { type: DataTypes.DECIMAL(4,2) },
  activity_minutes: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATEONLY, allowNull: false }
}, {
  tableName: "health_data",
  timestamps: false
});

// Relation : un user a plusieurs entrées santé
User.hasMany(HealthData, { foreignKey: "user_id" });
HealthData.belongsTo(User, { foreignKey: "user_id" });
