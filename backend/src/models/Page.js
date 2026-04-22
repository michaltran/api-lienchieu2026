const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Page = sequelize.define(
  'Page',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(300), allowNull: false },
    slug: { type: DataTypes.STRING(350), allowNull: false, unique: true },
    content: { type: DataTypes.TEXT('long'), allowNull: true },
    thumbnail: { type: DataTypes.STRING(500), allowNull: true },
    thumbnailPublicId: { type: DataTypes.STRING(255), allowNull: true },
    template: {
      type: DataTypes.STRING(50),
      defaultValue: 'default',
      comment: 'default, contact, about, gallery...',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Dữ liệu bổ sung tuỳ template (tọa độ map, số điện thoại...)',
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      defaultValue: 'published',
    },
    seoTitle: { type: DataTypes.STRING(255), allowNull: true },
    seoDescription: { type: DataTypes.TEXT, allowNull: true },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { tableName: 'pages' }
);

module.exports = Page;
