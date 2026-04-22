const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define(
  'Service',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(300), allowNull: true, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    icon: { type: DataTypes.STRING(100), allowNull: true, comment: 'Lucide icon name' },
    image: { type: DataTypes.STRING(500), allowNull: true },
    imagePublicId: { type: DataTypes.STRING(255), allowNull: true },
    category: { type: DataTypes.STRING(100), allowNull: true },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: 'services' }
);

Service.prototype.toJSON = function () {
  const v = { ...this.get() };
  v.id = String(v.id);
  return v;
};

module.exports = Service;
