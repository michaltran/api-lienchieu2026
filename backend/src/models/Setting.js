const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Setting = sequelize.define(
  'Setting',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    key: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    value: { type: DataTypes.TEXT, allowNull: true },
    type: {
      type: DataTypes.ENUM('text', 'textarea', 'number', 'boolean', 'json', 'image', 'color'),
      defaultValue: 'text',
    },
    group: {
      type: DataTypes.STRING(100),
      defaultValue: 'general',
      comment: 'general, logo, contact, social, seo, footer...',
    },
    label: { type: DataTypes.STRING(255), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: 'settings',
    indexes: [{ fields: ['group'] }, { fields: ['key'] }],
  }
);

module.exports = Setting;
