import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import ApiError from '../utils/ApiError.js';

/**
 * Upload a single image buffer to Cloudinary
 */
export const uploadToCloudinary = (fileBuffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: 'image',
      transformation: [
        {
          width: options.width || 1200,
          height: options.height || 800,
          crop: 'fill',
          quality: 'auto:best',
          format: 'webp',
        },
      ],
      ...options,
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(ApiError.internal(`Upload failed: ${error.message}`));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

/**
 * Upload multiple image buffers to Cloudinary
 */
export const uploadMultipleToCloudinary = async (files, folder) => {
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, folder)
  );

  return Promise.all(uploadPromises);
};

/**
 * Delete an image from Cloudinary by public ID
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw ApiError.internal(`Delete failed: ${error.message}`);
  }
};

/**
 * Delete multiple images from Cloudinary
 */
export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Cloudinary bulk delete error:', error);
    throw ApiError.internal(`Bulk delete failed: ${error.message}`);
  }
};
