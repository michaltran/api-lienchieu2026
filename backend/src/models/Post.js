const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define(
  'Post',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(300), allowNull: false },
    slug: { type: DataTypes.STRING(350), allowNull: false, unique: true },
    // PostType khớp FE
    type: {
      type: DataTypes.ENUM('news', 'health', 'training', 'procurement', 'adminReform', 'recruitment', 'other'),
      defaultValue: 'news',
    },
    excerpt: { type: DataTypes.TEXT, allowNull: true },
    content: { type: DataTypes.TEXT('long'), allowNull: true },
    // Đổi tên field theo contract FE: coverUrl thay vì thumbnail
    coverUrl: { type: DataTypes.STRING(500), allowNull: true },
    coverPublicId: { type: DataTypes.STRING(255), allowNull: true },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft',
    },
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
    isPinned: { type: DataTypes.BOOLEAN, defaultValue: false },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
    tags: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },
    seoTitle: { type: DataTypes.STRING(255), allowNull: true },
    seoDescription: { type: DataTypes.TEXT, allowNull: true },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'posts',
    indexes: [
      { fields: ['slug'] },
      { fields: ['type'] },
      { fields: ['categoryId'] },
      { fields: ['status'] },
      { fields: ['publishedAt'] },
    ],
  }
);

// toJSON: id string cho khớp FE, chuẩn hoá tên field
Post.prototype.toJSON = function () {
  const v = { ...this.get() };
  v.id = String(v.id);
  if (v.categoryId) v.categoryId = String(v.categoryId);
  if (v.authorId) v.authorId = String(v.authorId);
  return v;
};

module.exports = Post;
