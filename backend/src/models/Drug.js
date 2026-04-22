const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Drug = sequelize.define(
  'Drug',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    slug: { type: DataTypes.STRING(300), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(300), allowNull: false, comment: 'Tên thuốc' },
    activeIngredient: { type: DataTypes.STRING(500), allowNull: true, comment: 'Hoạt chất' },
    dosageForm: { type: DataTypes.STRING(255), allowNull: true, comment: 'Dạng bào chế' },
    strength: { type: DataTypes.STRING(255), allowNull: true, comment: 'Hàm lượng' },
    manufacturer: { type: DataTypes.STRING(255), allowNull: true },
    country: { type: DataTypes.STRING(100), allowNull: true },
    registrationNumber: { type: DataTypes.STRING(100), allowNull: true, comment: 'Số đăng ký' },
    indication: { type: DataTypes.TEXT, allowNull: true, comment: 'Chỉ định' },
    contraindication: { type: DataTypes.TEXT, allowNull: true, comment: 'Chống chỉ định' },
    dosage: { type: DataTypes.TEXT, allowNull: true, comment: 'Liều dùng' },
    sideEffects: { type: DataTypes.TEXT, allowNull: true, comment: 'Tác dụng phụ' },
    interactions: { type: DataTypes.TEXT, allowNull: true, comment: 'Tương tác thuốc' },
    storage: { type: DataTypes.TEXT, allowNull: true, comment: 'Bảo quản' },
    packing: { type: DataTypes.STRING(255), allowNull: true, comment: 'Đóng gói' },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    isBHYT: { type: DataTypes.BOOLEAN, defaultValue: false, comment: 'Thuốc BHYT' },
    category: { type: DataTypes.STRING(150), allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: 'drugs', indexes: [{ fields: ['name'] }, { fields: ['activeIngredient'] }] }
);

Drug.prototype.toJSON = function () {
  const v = { ...this.get() };
  v.id = String(v.id);
  return v;
};

module.exports = Drug;
