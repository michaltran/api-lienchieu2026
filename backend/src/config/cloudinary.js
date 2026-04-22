require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const FOLDER = process.env.CLOUDINARY_FOLDER || 'lienchieu';

// Storage cho ảnh
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: `${FOLDER}/images`,
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    transformation: [{ quality: 'auto:good' }],
  }),
});

// Storage cho video
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: `${FOLDER}/videos`,
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
  }),
});

// Storage chung (tự nhận diện)
const mediaStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video');
    return {
      folder: `${FOLDER}/${isVideo ? 'videos' : 'images'}`,
      resource_type: isVideo ? 'video' : 'image',
    };
  },
});

// Multer instances
const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: parseInt(process.env.MAX_IMAGE_SIZE) || 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Chỉ chấp nhận file ảnh'));
  },
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: parseInt(process.env.MAX_VIDEO_SIZE) || 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Chỉ chấp nhận file video'));
  },
});

const uploadMedia = multer({
  storage: mediaStorage,
  limits: { fileSize: parseInt(process.env.MAX_VIDEO_SIZE) || 100 * 1024 * 1024 },
});

// Helper xoá file trên Cloudinary
const deleteCloudinaryFile = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return true;
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
    return false;
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadVideo,
  uploadMedia,
  deleteCloudinaryFile,
};
