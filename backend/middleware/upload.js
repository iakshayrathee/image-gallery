const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if the file is an image
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    
    // Check for specific image types
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG and PNG images are allowed'), false);
    }
    
    cb(null, true);
  }
});

// Custom error handler for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 3MB.'
      });
    }
    
    if (error.code === 'LIMIT_FILE_TYPE') {
      return res.status(400).json({
        error: 'Invalid file type. Only JPEG and PNG images are allowed.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      error: 'Only image files are allowed'
    });
  }
  
  next(error);
};

module.exports = {
  upload,
  handleMulterError
};