const express = require('express');
const router = express.Router();

const { upload, handleMulterError } = require('../middleware/upload');
const imageStorage = require('../utils/storage');

// POST /api/upload - Upload a single image
router.post('/upload', upload.single('image'), handleMulterError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Store the image in memory
    const imageData = imageStorage.storeImage(req.file);

    // Return metadata without the buffer
    const responseData = {
      id: imageData.id,
      filename: imageData.filename,
      mimeType: imageData.mimeType,
      uploadedAt: imageData.uploadedAt
    };

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: responseData
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// GET /api/images - Get all images metadata
router.get('/images', (req, res) => {
  try {
    const images = imageStorage.getAllImages();
    res.json({ images });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
});

// GET /api/images/:id - Get image by ID
router.get('/images/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!imageStorage.hasImage(id)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const image = imageStorage.getImageById(id);
    
    // Set appropriate content type
    res.set('Content-Type', image.mimeType);
    res.set('Content-Disposition', `inline; filename="${image.filename}"`);
    
    // Send the image buffer
    res.send(image.buffer);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
});

// DELETE /api/images/:id - Delete image by ID
router.delete('/images/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!imageStorage.hasImage(id)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const deleted = imageStorage.deleteImage(id);
    
    if (deleted) {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete image' });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;