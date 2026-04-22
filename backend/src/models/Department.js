const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Department = sequelize.define(
  'Department',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(300), allowNull: false, unique: true },
    block: {
      type: DataTypes.ENUM('lam-sang', 'can-lam-sang', 'hanh-chinh'),
      allowNull: false,
      defaultValue: 'lam-sang',
    },
    leaders: {
      type: DataTypes.JSONB, defaultValue: [],
      comment: 'Danh sách lãnh đạo [{name, title}]',
    },
    teamImage: { type: DataTypes.STRING(500), allowNull: true },
    teamImagePublicId: { type: DataTypes.STRING(255), allowNull: true },
    missionText: { type: DataTypes.TEXT, allowNull: true },
    duties: { type: DataTypes.JSONB, defaultValue: [], comment: 'Nhiệm vụ (array of string)' },
    info: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: '{phone, email, workingHours, location, services:[]}',
    },
    highlights: {
      type: DataTypes.JSONB, defaultValue: [],
      comment: '[{title, image}]',
    },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: 'departments' }
);

Department.prototype.toJSON = function () {
  const v = { ...this.get() };
  v.id = String(v.id);
  return v;
};

module.exports = Department;
