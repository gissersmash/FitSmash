// backend/src/models/HealthEntry.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const HealthEntry = sequelize.define("HealthEntry", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  weight: { type: DataTypes.FLOAT, allowNull: false },
  sleep: { type: DataTypes.FLOAT, allowNull: false },
  activity: { type: DataTypes.FLOAT, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});

export default HealthEntry;
