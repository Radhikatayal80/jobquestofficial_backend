import multer from "multer";

// Set up multer memory storage
const storage = multer.memoryStorage();

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']; // Adjust as necessary
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
    }
    cb(null, true); // Accept the file
};

// Create multer instance with storage and file filter
export const singleUpload = multer({ 
    storage, 
    fileFilter, 
}).single("file");
