import multer from 'multer';
import path from 'path';

import fs from 'fs';

// Configure storage for multer
// Using memory storage for Vercel Blob compatibility
const storage = multer.memoryStorage();

// Create the multer instance
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image and pdf files as an example
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  }
});
