const { v4: uuidv4 } = require('uuid');

class ImageStorage {
  constructor() {
    this.images = new Map();
  }

  // Store an image with metadata
  storeImage(file) {
    const id = uuidv4();
    const imageData = {
      id,
      filename: file.originalname,
      mimeType: file.mimetype,
      buffer: file.buffer,
      uploadedAt: new Date().toISOString()
    };

    this.images.set(id, imageData);
    return imageData;
  }

  // Get all images metadata (without buffer data)
  getAllImages() {
    const images = [];
    for (const [id, image] of this.images.entries()) {
      images.push({
        id: image.id,
        filename: image.filename,
        mimeType: image.mimeType,
        uploadedAt: image.uploadedAt
      });
    }
    return images;
  }

  // Get image by ID
  getImageById(id) {
    return this.images.get(id);
  }

  // Delete image by ID
  deleteImage(id) {
    return this.images.delete(id);
  }

  // Check if image exists
  hasImage(id) {
    return this.images.has(id);
  }

  // Get total number of images
  getImageCount() {
    return this.images.size;
  }

  // Clear all images (for testing)
  clear() {
    this.images.clear();
  }
}

// Create a singleton instance
const imageStorage = new ImageStorage();

module.exports = imageStorage;