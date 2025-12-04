import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER, // en minutes
    allowNull: false
  },
  calories_burned: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  met_value: {
    type: DataTypes.FLOAT, // Metabolic Equivalent of Task
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'activities',
  timestamps: true
});

export default Activity;
