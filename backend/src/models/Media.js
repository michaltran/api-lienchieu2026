const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Media = sequelize.define(
  'Media',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    type: {
      type: DataTypes.ENUM('image', 'video'),
      allowNull: false,
    },
    url: { type: DataTypes.STRING(500), allowNull: false },
    publicId: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    thumbnail: { type: DataTypes.STRING(500), allowNull: true },
    format: { type: DataTypes.STRING(20), allowNull: true },
    size: { type: DataTypes.BIGINT, allowNull: true },
    width: { type: DataTypes.INTEGER, allowNull: true },
    height: { type: DataTypes.INTEGER, allowNull: true },
    duration: { type: DataTypes.FLOAT, allowNull: true },
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'albums', key: 'id' },
      onDelete: 'SET NULL',
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    tags: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },
  },
  { tableName: 'media' }
);

module.exports = Media;
