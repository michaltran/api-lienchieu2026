const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Album = sequelize.define(
  'Album',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(300), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    coverImage: { type: DataTypes.STRING(500), allowNull: true },
    type: {
      type: DataTypes.ENUM('image', 'video', 'mixed'),
      defaultValue: 'image',
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { tableName: 'albums' }
);

module.exports = Album;
