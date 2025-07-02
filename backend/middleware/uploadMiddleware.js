const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Define allowed file types
const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const allowedDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type based on field name
  if (file.fieldname === 'avatar' || file.fieldname === 'images' || file.fieldname === 'image') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'), false);
    }
  } else if (file.fieldname === 'businessLicense') {
    if (allowedDocumentTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed for business license!'), false);
    }
  } else {
    cb(new Error('Invalid field name!'), false);
  }
};

// Cloudinary storage for different file types
const createCloudinaryStorage = (folder, transformation = null) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `kencommerce/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'],
      transformation: transformation,
      public_id: (req, file) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        return `${file.fieldname}-${uniqueSuffix}`;
      }
    }
  });
};

// Local storage configuration (fallback if Cloudinary is not configured)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'avatar') {
      uploadPath += 'avatars/';
    } else if (file.fieldname === 'images') {
      uploadPath += 'products/';
    } else if (file.fieldname === 'image') {
      uploadPath += 'categories/';
    } else if (file.fieldname === 'businessLicense') {
      uploadPath += 'documents/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Choose storage based on environment
const getStorage = (folder, transformation = null) => {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    return createCloudinaryStorage(folder, transformation);
  } else {
    console.warn('Cloudinary not configured, using local storage');
    return localStorage;
  }
};

// Multer configurations for different use cases

// Single avatar upload
const uploadAvatar = multer({
  storage: getStorage('users', [
    { width: 200, height: 200, crop: 'fill', gravity: 'face' },
    { quality: 'auto', format: 'auto' }
  ]),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('avatar');

// Multiple product images upload
const uploadProductImages = multer({
  storage: getStorage('products', [
    { width: 800, height: 800, crop: 'fit' },
    { quality: 'auto', format: 'auto' }
  ]),
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10 // Maximum 10 files
  }
}).array('images', 10);

// Single category image upload
const uploadCategoryImage = multer({
  storage: getStorage('categories', [
    { width: 400, height: 400, crop: 'fit' },
    { quality: 'auto', format: 'auto' }
  ]),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image');

// Business license document upload
const uploadBusinessLicense = multer({
  storage: getStorage('documents'),
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit for documents
  }
}).single('businessLicense');

// Generic file upload (for admin use)
const uploadGeneric = multer({
  storage: getStorage('general'),
  fileFilter: (req, file, cb) => {
    // Allow all common file types for admin
    const allowedTypes = [
      ...allowedImageTypes,
      ...allowedDocumentTypes,
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed!'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for admin uploads
  }
}).single('file');

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Please upload a smaller file.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Please reduce the number of files.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name. Please check your form data.'
      });
    }
  }
  
  if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// Utility function to delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    }
    return null;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return null;
  }
};

// Utility function to extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  try {
    if (!url || !url.includes('cloudinary')) {
      return null;
    }
    
    const urlParts = url.split('/');
    const fileWithExtension = urlParts[urlParts.length - 1];
    const fileName = fileWithExtension.split('.')[0];
    
    // Find the index of the version (starts with 'v' followed by numbers)
    const versionIndex = urlParts.findIndex(part => /^v\d+$/.test(part));
    
    if (versionIndex !== -1 && versionIndex < urlParts.length - 1) {
      // Reconstruct the public ID including folder structure
      const folderParts = urlParts.slice(versionIndex + 1, -1);
      return [...folderParts, fileName].join('/');
    }
    
    return fileName;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

// Create wrapped upload functions that include error handling
const createUploadMiddleware = (uploadFunction) => {
  return (req, res, next) => {
    uploadFunction(req, res, (error) => {
      if (error) {
        return handleUploadError(error, req, res, next);
      }
      next();
    });
  };
};

// Export wrapped upload functions
const upload = {
  avatar: createUploadMiddleware(uploadAvatar),
  productImages: createUploadMiddleware(uploadProductImages),
  categoryImage: createUploadMiddleware(uploadCategoryImage),
  businessLicense: createUploadMiddleware(uploadBusinessLicense),
  generic: createUploadMiddleware(uploadGeneric),
  handleError: handleUploadError,
  deleteFromCloudinary,
  extractPublicId
};

module.exports = { upload, cloudinary, uploadProductImages };
