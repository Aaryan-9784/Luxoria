import multer from 'multer';
import ApiError from '../utils/ApiError.js';
import { UPLOAD } from '../constants/index.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (UPLOAD.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Invalid file type: ${file.mimetype}. Allowed: ${UPLOAD.ALLOWED_TYPES.join(', ')}`
      ),
      false
    );
  }
};

export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: UPLOAD.MAX_FILE_SIZE },
}).single('image');

export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE,
    files: UPLOAD.MAX_FILES,
  },
}).array('images', UPLOAD.MAX_FILES);
