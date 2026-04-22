const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Hộp thư bạn đọc / Liên hệ
const ContactMessage = sequelize.define(
  'ContactMessage',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    senderName: { type: DataTypes.STRING(255), allowNull: false },
    senderEmail: { type: DataTypes.STRING(150), allowNull: true },
    senderPhone: { type: DataTypes.STRING(20), allowNull: true },
    subject: { type: DataTypes.STRING(500), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    attachments: { type: DataTypes.JSONB, defaultValue: [] },
    status: {
      type: DataTypes.ENUM('new', 'processing', 'replied', 'closed'),
      defaultValue: 'new',
    },
    adminReply: { type: DataTypes.TEXT, allowNull: true },
    replyAt: { type: DataTypes.DATE, allowNull: true },
    replyBy: {
      type: DataTypes.INTEGER, allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    type: {
      type: DataTypes.ENUM('mailbox', 'contact', 'feedback'),
      defaultValue: 'mailbox',
    },
  },
  { tableName: 'contact_messages' }
);

ContactMessage.prototype.toJSON = function () {
  const v = { ...this.get() };
  v.id = String(v.id);
  return v;
};

module.exports = ContactMessage;
