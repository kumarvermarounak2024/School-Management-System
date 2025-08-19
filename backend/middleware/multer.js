const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
  fileFilter: (req, file, cb) => {
    // Accept common document types and images
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Middleware configuration for employee creation
const employeeUpload = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'documents', maxCount: 10 } // Allow up to 10 documents
]);

// Export the middleware
module.exports = {
  employeeUpload,
  upload
};

// Usage in your route:
// router.post('/create', employeeUpload, createEmployee);