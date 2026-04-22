const { Department, Doctor, Service, Drug } = require('../models');
const { makeCrud } = require('../utils/crud');

exports.department = makeCrud(Department, {
  searchFields: ['name', 'missionText'],
  slugFromField: 'name',
  cloudinaryFields: [{ publicId: 'teamImagePublicId', type: 'image' }],
  filters: { block: 'block', isActive: 'isActive' },
  orderBy: [['orderIndex', 'ASC'], ['name', 'ASC']],
  entityName: 'department',
});

exports.doctor = makeCrud(Doctor, {
  searchFields: ['name', 'title', 'specialty', 'bio'],
  slugFromField: 'name',
  cloudinaryFields: [{ publicId: 'avatarPublicId', type: 'image' }],
  filters: { departmentId: 'departmentId', specialtyId: 'specialtyId', featured: 'featured', isActive: 'isActive' },
  include: [{ model: Department, as: 'department', attributes: ['id', 'name', 'slug', 'block'] }],
  orderBy: [['featured', 'DESC'], ['orderIndex', 'ASC']],
  entityName: 'doctor',
});

exports.service = makeCrud(Service, {
  searchFields: ['title', 'description'],
  slugFromField: 'title',
  cloudinaryFields: [{ publicId: 'imagePublicId', type: 'image' }],
  filters: { category: 'category', isActive: 'isActive' },
  entityName: 'service',
});

exports.drug = makeCrud(Drug, {
  searchFields: ['name', 'activeIngredient', 'manufacturer'],
  slugFromField: 'name',
  filters: { category: 'category', isBHYT: 'isBHYT', isActive: 'isActive' },
  orderBy: [['name', 'ASC']],
  entityName: 'drug',
});
