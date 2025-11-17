const request = require('supertest');
const express = require('express');

// Mock the image storage FIRST
jest.mock('../utils/storage');
const imageStorage = require('../utils/storage');

// Clear the require cache for routes to ensure fresh import after mocking
const clearRoutesCache = () => {
  const routesPath = require.resolve('../routes/images');
  delete require.cache[routesPath];
};

// Create a test app instance
const createTestApp = () => {
  // Clear cache and require fresh routes
  clearRoutesCache();
  const imageRoutes = require('../routes/images');
  
  const app = express();
  app.use(express.json());
  app.use('/api', imageRoutes);
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
  });
  
  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
  
  return app;
};

describe('Images API', () => {
  let app;
  
  beforeEach(() => {
    // Create a new app instance for each test
    app = createTestApp();
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/images', () => {
    test('should return empty array when no images', async () => {
      imageStorage.getAllImages.mockReturnValue([]);

      const response = await request(app).get('/api/images');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ images: [] });
      expect(imageStorage.getAllImages).toHaveBeenCalledTimes(1);
    });

    test('should return array of images', async () => {
      const mockImages = [
        { id: '1', filename: 'test1.jpg', mimeType: 'image/jpeg', uploadedAt: '2023-01-01' },
        { id: '2', filename: 'test2.png', mimeType: 'image/png', uploadedAt: '2023-01-02' }
      ];
      
      imageStorage.getAllImages.mockReturnValue(mockImages);

      const response = await request(app).get('/api/images');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ images: mockImages });
      expect(imageStorage.getAllImages).toHaveBeenCalledTimes(1);
    });

    test('should handle storage errors', async () => {
      imageStorage.getAllImages.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const response = await request(app).get('/api/images');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to retrieve images' });
    });
  });

  describe('GET /api/images/:id', () => {
    test('should return 404 for non-existent image', async () => {
      imageStorage.hasImage.mockReturnValue(false);

      const response = await request(app).get('/api/images/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Image not found' });
      expect(imageStorage.hasImage).toHaveBeenCalledWith('non-existent-id');
    });

    test('should return image data for existing image', async () => {
      const mockImage = {
        id: 'test-id',
        filename: 'test.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('test image data'),
        uploadedAt: '2023-01-01'
      };

      imageStorage.hasImage.mockReturnValue(true);
      imageStorage.getImageById.mockReturnValue(mockImage);

      const response = await request(app).get('/api/images/test-id');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('image/jpeg');
      expect(response.headers['content-disposition']).toBe('inline; filename="test.jpg"');
      expect(response.body).toEqual(Buffer.from('test image data'));
      
      expect(imageStorage.hasImage).toHaveBeenCalledWith('test-id');
      expect(imageStorage.getImageById).toHaveBeenCalledWith('test-id');
    });

    test('should handle storage errors', async () => {
      imageStorage.hasImage.mockReturnValue(true);
      imageStorage.getImageById.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const response = await request(app).get('/api/images/test-id');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to retrieve image' });
    });
  });

  describe('DELETE /api/images/:id', () => {
    test('should return 404 for non-existent image', async () => {
      imageStorage.hasImage.mockReturnValue(false);

      const response = await request(app).delete('/api/images/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Image not found' });
      expect(imageStorage.hasImage).toHaveBeenCalledWith('non-existent-id');
    });

    test('should delete existing image', async () => {
      imageStorage.hasImage.mockReturnValue(true);
      imageStorage.deleteImage.mockReturnValue(true);

      const response = await request(app).delete('/api/images/test-id');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Image deleted successfully' });
      
      expect(imageStorage.hasImage).toHaveBeenCalledWith('test-id');
      expect(imageStorage.deleteImage).toHaveBeenCalledWith('test-id');
    });

    test('should handle delete failure', async () => {
      imageStorage.hasImage.mockReturnValue(true);
      imageStorage.deleteImage.mockReturnValue(false);

      const response = await request(app).delete('/api/images/test-id');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete image' });
    });

    test('should handle storage errors', async () => {
      imageStorage.hasImage.mockReturnValue(true);
      imageStorage.deleteImage.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const response = await request(app).delete('/api/images/test-id');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete image' });
    });
  });

  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        status: 'OK', 
        message: 'Server is running' 
      });
    });
  });

  describe('404 Handler', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Route not found' });
    });
  });
});