const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING(255), allowNull: false },
    name: { type: DataTypes.STRING(150), allowNull: true, comment: 'Tên hiển thị' },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    avatar: { type: DataTypes.STRING(500), allowNull: true },
    avatarPublicId: { type: DataTypes.STRING(255), allowNull: true },
    role: {
      type: DataTypes.ENUM('admin', 'editor', 'viewer', 'super_admin', 'author'),
      allowNull: false,
      defaultValue: 'editor',
    },
    permissions: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'locked'),
      defaultValue: 'active',
    },
    lastLogin: { type: DataTypes.DATE, allowNull: true },
    lastLoginIp: { type: DataTypes.STRING(50), allowNull: true },
    refreshToken: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) user.password = await bcrypt.hash(user.password, 10);
      },
    },
  }
);

User.prototype.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Khớp AuthUser interface của FE: {id:string, name, role, email, avatar}
User.prototype.toJSON = function () {
  const v = { ...this.get() };
  delete v.password;
  delete v.refreshToken;
  v.id = String(v.id);
  return v;
};

module.exports = User;
