const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Banner = sequelize.define(
  'Banner',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: true },
    subtitle: { type: DataTypes.STRING(500), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    image: { type: DataTypes.STRING(500), allowNull: false },
    imagePublicId: { type: DataTypes.STRING(255), allowNull: true },
    mobileImage: { type: DataTypes.STRING(500), allowNull: true },
    mobileImagePublicId: { type: DataTypes.STRING(255), allowNull: true },
    link: { type: DataTypes.STRING(500), allowNull: true },
    buttonText: { type: DataTypes.STRING(100), allowNull: true },
    position: {
      type: DataTypes.ENUM('homepage_hero', 'homepage_middle', 'sidebar', 'popup'),
      defaultValue: 'homepage_hero',
    },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    startDate: { type: DataTypes.DATE, allowNull: true },
    endDate: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'banners' }
);

module.exports = Banner;
