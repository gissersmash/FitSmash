import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Goal = sequelize.define("Goal", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.FLOAT, allowNull: false },
}, {
  tableName: "goals",
  timestamps: false
});
