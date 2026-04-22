const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Doctor = sequelize.define(
  'Doctor',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    slug: { type: DataTypes.STRING(300), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: true, comment: 'Chức danh: BS CKII, ThS. BS...' },
    specialty: { type: DataTypes.STRING(255), allowNull: true },
    specialtyId: { type: DataTypes.STRING(100), allowNull: true },
    departmentId: {
      type: DataTypes.INTEGER, allowNull: true,
      references: { model: 'departments', key: 'id' },
    },
    experienceYears: { type: DataTypes.INTEGER, defaultValue: 0 },
    languages: { type: DataTypes.JSONB, defaultValue: [] },
    avatar: { type: DataTypes.STRING(500), allowNull: true },
    avatarPublicId: { type: DataTypes.STRING(255), allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    tags: { type: DataTypes.JSONB, defaultValue: [] },
    scheduleNote: { type: DataTypes.TEXT, allowNull: true },
    featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    externalId: { type: DataTypes.STRING(100), allowNull: true },
    facility: { type: DataTypes.STRING(255), allowNull: true },
    expertise: { type: DataTypes.JSONB, defaultValue: [] },
    experience: { type: DataTypes.JSONB, defaultValue: [] },
    education: { type: DataTypes.JSONB, defaultValue: [] },
    publications: { type: DataTypes.JSONB, defaultValue: [] },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: 'doctors' }
);

Doctor.prototype.toJSON = function () {
  const v = { ...this.get() };
  v.id = String(v.id);
  if (v.departmentId) v.departmentId = String(v.departmentId);
  return v;
};

module.exports = Doctor;
