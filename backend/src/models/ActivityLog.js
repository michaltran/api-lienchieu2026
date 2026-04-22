const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ActivityLog = sequelize.define(
  'ActivityLog',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'SET NULL',
    },
    action: { type: DataTypes.STRING(100), allowNull: false },
    entity: { type: DataTypes.STRING(100), allowNull: true },
    entityId: { type: DataTypes.INTEGER, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    ipAddress: { type: DataTypes.STRING(50), allowNull: true },
    userAgent: { type: DataTypes.STRING(500), allowNull: true },
    metadata: { type: DataTypes.JSONB, allowNull: true },
  },
  {
    tableName: 'activity_logs',
    indexes: [{ fields: ['userId'] }, { fields: ['entity'] }, { fields: ['createdAt'] }],
  }
);

module.exports = ActivityLog;
