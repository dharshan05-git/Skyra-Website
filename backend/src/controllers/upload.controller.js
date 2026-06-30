import { uploadBuffer, deleteImage } from '../services/cloudinary.service.js';
import { success } from '../utils/ApiResponse.js';
export const upload = async (req, res) => success(res, { images: await Promise.all((req.files || []).map(uploadBuffer)) }, 'Images uploaded', 201);
export const remove = async (req, res) => { await deleteImage(req.body.publicId); return success(res, null, 'Image deleted'); };
