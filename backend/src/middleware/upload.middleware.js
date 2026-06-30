import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
export const uploadImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, cb) => allowed.has(file.mimetype)
    ? cb(null, true)
    : cb(new ApiError(415, 'Only JPEG, PNG, and WebP images are allowed')),
}).array('images', 8);
