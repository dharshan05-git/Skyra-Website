import { cloudinary, cloudinaryConfigured } from '../config/cloudinary.js';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

export async function uploadBuffer(file) {
  if (!cloudinaryConfigured) throw new ApiError(503, 'Image service is not configured');
  return new Promise((resolve, reject) => { const stream = cloudinary.uploader.upload_stream({ folder: env.CLOUDINARY_FOLDER, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] }, (error, result) => error ? reject(error) : resolve({ url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height })); stream.end(file.buffer); });
}
export async function deleteImage(publicId) { if (!cloudinaryConfigured) throw new ApiError(503, 'Image service is not configured'); return cloudinary.uploader.destroy(publicId, { resource_type: 'image' }); }
