const { sequelize } = require('../config/database');

const User = require('./User');
const Menu = require('./Menu');
const Category = require('./Category');
const Post = require('./Post');
const Page = require('./Page');
const Banner = require('./Banner');
const Media = require('./Media');
const Album = require('./Album');
const Setting = require('./Setting');
const ActivityLog = require('./ActivityLog');
const Department = require('./Department');
const Doctor = require('./Doctor');
const Service = require('./Service');
const Drug = require('./Drug');
const Appointment = require('./Appointment');
const ContactMessage = require('./ContactMessage');

// Associations
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(Post, { foreignKey: 'authorId' });

Post.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });
Category.hasMany(Post, { foreignKey: 'categoryId' });

Media.belongsTo(Album, { as: 'album', foreignKey: 'albumId' });
Album.hasMany(Media, { as: 'items', foreignKey: 'albumId' });
Media.belongsTo(User, { as: 'uploader', foreignKey: 'uploadedBy' });

ActivityLog.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Doctor.belongsTo(Department, { as: 'department', foreignKey: 'departmentId' });
Department.hasMany(Doctor, { as: 'doctors', foreignKey: 'departmentId' });

Appointment.belongsTo(Department, { as: 'department', foreignKey: 'departmentId' });
Appointment.belongsTo(Doctor, { as: 'doctor', foreignKey: 'doctorId' });
Appointment.belongsTo(User, { as: 'confirmer', foreignKey: 'confirmedBy' });

ContactMessage.belongsTo(User, { as: 'replier', foreignKey: 'replyBy' });

module.exports = {
  sequelize,
  User, Menu, Category, Post, Page, Banner, Media, Album,
  Setting, ActivityLog, Department, Doctor, Service, Drug,
  Appointment, ContactMessage,
};
