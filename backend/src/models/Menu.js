const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Menu = sequelize.define(
  'Menu',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    slug: { type: DataTypes.STRING(250), allowNull: false, unique: true },
    url: { type: DataTypes.STRING(500), allowNull: true },
    icon: { type: DataTypes.STRING(100), allowNull: true },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'menus', key: 'id' },
      onDelete: 'CASCADE',
    },
    position: {
      type: DataTypes.ENUM('header', 'footer', 'sidebar'),
      defaultValue: 'header',
    },
    type: {
      type: DataTypes.ENUM('page', 'category', 'external', 'custom'),
      defaultValue: 'page',
    },
    targetId: { type: DataTypes.INTEGER, allowNull: true },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    openNewTab: { type: DataTypes.BOOLEAN, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: 'menus',
    indexes: [
      { fields: ['parentId'] },
      { fields: ['position'] },
      { fields: ['orderIndex'] },
    ],
  }
);

Menu.hasMany(Menu, { as: 'children', foreignKey: 'parentId' });
Menu.belongsTo(Menu, { as: 'parent', foreignKey: 'parentId' });

module.exports = Menu;
