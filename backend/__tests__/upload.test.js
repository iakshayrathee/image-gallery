const multer = require('multer');
const { upload, handleMulterError } = require('../middleware/upload');

// Mock Express request/response objects
const createMockRequest = (file) => ({
  file,
  body: {}
});

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const createMockNext = () => jest.fn();

describe('Upload Middleware', () => {
  describe('File Filter', () => {
    test('should accept JPEG images', (done) => {
      const file = {
        mimetype: 'image/jpeg',
        originalname: 'test.jpg'
      };

      upload.fileFilter(null, file, (error, shouldAccept) => {
        expect(error).toBeNull();
        expect(shouldAccept).toBe(true);
        done();
      });
    });

    test('should accept PNG images', (done) => {
      const file = {
        mimetype: 'image/png',
        originalname: 'test.png'
      };

      upload.fileFilter(null, file, (error, shouldAccept) => {
        expect(error).toBeNull();
        expect(shouldAccept).toBe(true);
        done();
      });
    });

    test('should reject non-image files', (done) => {
      const file = {
        mimetype: 'application/pdf',
        originalname: 'document.pdf'
      };

      upload.fileFilter(null, file, (error, shouldAccept) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Only image files are allowed');
        expect(shouldAccept).toBe(false);
        done();
      });
    });

    test('should reject unsupported image types', (done) => {
      const file = {
        mimetype: 'image/gif',
        originalname: 'animation.gif'
      };

      upload.fileFilter(null, file, (error, shouldAccept) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Invalid file type. Only JPEG and PNG images are allowed');
        expect(shouldAccept).toBe(false);
        done();
      });
    });
  });

  describe('Error Handler', () => {
    test('should handle file size limit error', () => {
      const error = new multer.MulterError('LIMIT_FILE_SIZE');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      handleMulterError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'File too large. Maximum size is 3MB.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should handle file type error from multer', () => {
      const error = new multer.MulterError('LIMIT_FILE_TYPE');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      handleMulterError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid file type. Only JPEG and PNG images are allowed.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should handle custom file filter error', () => {
      const error = new Error('Only image files are allowed');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      handleMulterError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Only image files are allowed'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should pass through unknown errors', () => {
      const error = new Error('Unknown error');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      handleMulterError(error, req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});