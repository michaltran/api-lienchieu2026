const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define(
  'Appointment',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patientName: { type: DataTypes.STRING(255), allowNull: false },
    patientPhone: { type: DataTypes.STRING(20), allowNull: false },
    patientEmail: { type: DataTypes.STRING(150), allowNull: true },
    patientBirthday: { type: DataTypes.DATEONLY, allowNull: true },
    patientGender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
    patientAddress: { type: DataTypes.STRING(500), allowNull: true },
    departmentId: {
      type: DataTypes.INTEGER, allowNull: true,
      references: { model: 'departments', key: 'id' },
    },
    doctorId: {
      type: DataTypes.INTEGER, allowNull: true,
      references: { model: 'doctors', key: 'id' },
    },
    preferredDate: { type: DataTypes.DATEONLY, allowNull: true },
    preferredTime: { type: DataTypes.STRING(20), allowNull: true },
    symptoms: { type: DataTypes.TEXT, allowNull: true },
    note: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    adminNote: { type: DataTypes.TEXT, allowNull: true },
    confirmedAt: { type: DataTypes.DATE, allowNull: true },
    confirmedBy: {
      type: DataTypes.INTEGER, allowNull: true,
      references: { model: 'users', key: 'id' },
    },
  },
  { tableName: 'appointments', indexes: [{ fields: ['status'] }, { fields: ['preferredDate'] }] }
);

Appointment.prototype.toJSON = function () {
  const v = { ...this.get() };
  v.id = String(v.id);
  return v;
};

module.exports = Appointment;
