const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary.
 * 
 * @param {Buffer} fileBuffer - The file buffer (from multer or similar).
 * @param {string} folder - Optional folder name on Cloudinary.
 * @param {string} originalname - Original file name (for logs, optional).
 * @param {string} mimetype - MIME type of the file, e.g., 'image/png'.
 * 
 * @returns {Object|null} Cloudinary upload response object or null if no buffer.
 * 
 * @throws Will throw error if upload fails.
 */
const uploadDocument = async (fileBuffer, folder = "postal_records", originalname = "unknown", mimetype = "application/octet-stream") => {
  try {
    if (!fileBuffer) {
      console.log("No file buffer provided for upload.");
      return null;
    }

    console.log(`Uploading file: ${originalname} with mimetype: ${mimetype} and size: ${fileBuffer.length} bytes`);

    // Convert buffer to base64 string
    const base64String = fileBuffer.toString('base64');

    // Prepare Data URI format required by Cloudinary
    const dataUri = `data:${mimetype};base64,${base64String}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "auto", // auto detects image, video, raw etc.
      use_filename: true,    // Use the original file name in Cloudinary (optional)
      unique_filename: false, // Prevent renaming the file (optional)
      overwrite: true,       // Overwrite if public_id exists (optional)
      timeout: 120000,
    });

    console.log("Upload successful:", result.secure_url);

    // Return useful info
    return {
      public_id: result.public_id,
      url: result.secure_url,
      format: result.format,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);

    // If Cloudinary returns a detailed error response, log it too
    if (error.http_code && error.http_code !== 200) {
      console.error(`Cloudinary HTTP error code: ${error.http_code}`);
    }
    if (error.message) {
      console.error(`Cloudinary error message: ${error.message}`);
    }

    throw new Error("Document upload failed");
  }
};

/**
 * Delete a file from Cloudinary by public ID.
 * 
 * @param {string} publicId - Public ID of the Cloudinary asset.
 * @param {string} resourceType - Resource type (default: 'image').
 * @returns {Object|null} Result of delete operation or null.
 * @throws Will throw error if deletion fails.
 */
const deleteDocument = async (publicId, resourceType = "image") => {
  try {
    if (!publicId) {
      console.log("No public ID provided for deletion.");
      return null;
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    console.log("Deletion result:", result);

    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Document deletion failed");
  }
};

module.exports = {
  uploadDocument,
  deleteDocument,
};
