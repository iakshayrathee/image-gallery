// Use jest.requireActual to get the real implementation, not the mock
const imageStorage = jest.requireActual('../utils/storage');

describe('ImageStorage', () => {
  let storage;

  beforeEach(() => {
    // Use the singleton instance and clear it before each test
    storage = imageStorage;
    storage.clear();
  });

  afterEach(() => {
    storage.clear();
  });

  test('should store an image with correct metadata', () => {
    const mockFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test image data')
    };

    const result = storage.storeImage(mockFile);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('filename', 'test.jpg');
    expect(result).toHaveProperty('mimeType', 'image/jpeg');
    expect(result).toHaveProperty('buffer');
    expect(result).toHaveProperty('uploadedAt');
    expect(typeof result.id).toBe('string');
    expect(result.id.length).toBeGreaterThan(0);
  });

  test('should retrieve all images without buffer data', () => {
    const mockFile1 = {
      originalname: 'test1.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test1')
    };
    
    const mockFile2 = {
      originalname: 'test2.png',
      mimetype: 'image/png',
      buffer: Buffer.from('test2')
    };

    storage.storeImage(mockFile1);
    storage.storeImage(mockFile2);

    const images = storage.getAllImages();

    expect(images).toHaveLength(2);
    expect(images[0]).toHaveProperty('id');
    expect(images[0]).toHaveProperty('filename', 'test1.jpg');
    expect(images[0]).toHaveProperty('mimeType', 'image/jpeg');
    expect(images[0]).toHaveProperty('uploadedAt');
    expect(images[0]).not.toHaveProperty('buffer');
    
    expect(images[1]).toHaveProperty('filename', 'test2.png');
    expect(images[1]).toHaveProperty('mimeType', 'image/png');
  });

  test('should retrieve image by ID with buffer', () => {
    const mockFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test image data')
    };

    const storedImage = storage.storeImage(mockFile);
    const retrievedImage = storage.getImageById(storedImage.id);

    expect(retrievedImage).toEqual(storedImage);
    expect(retrievedImage.buffer).toEqual(Buffer.from('test image data'));
  });

  test('should return undefined for non-existent image ID', () => {
    const result = storage.getImageById('non-existent-id');
    expect(result).toBeUndefined();
  });

  test('should delete image by ID', () => {
    const mockFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test image data')
    };

    const storedImage = storage.storeImage(mockFile);
    expect(storage.hasImage(storedImage.id)).toBe(true);
    
    const deleted = storage.deleteImage(storedImage.id);
    expect(deleted).toBe(true);
    expect(storage.hasImage(storedImage.id)).toBe(false);
  });

  test('should return false when deleting non-existent image', () => {
    const deleted = storage.deleteImage('non-existent-id');
    expect(deleted).toBe(false);
  });

  test('should check if image exists', () => {
    const mockFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test image data')
    };

    const storedImage = storage.storeImage(mockFile);
    expect(storage.hasImage(storedImage.id)).toBe(true);
    expect(storage.hasImage('non-existent-id')).toBe(false);
  });

  test('should return correct image count', () => {
    expect(storage.getImageCount()).toBe(0);
    
    const mockFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test image data')
    };

    storage.storeImage(mockFile);
    expect(storage.getImageCount()).toBe(1);
    
    storage.storeImage({...mockFile, originalname: 'test2.jpg'});
    expect(storage.getImageCount()).toBe(2);
  });

  test('should clear all images', () => {
    const mockFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test image data')
    };

    storage.storeImage(mockFile);
    expect(storage.getImageCount()).toBe(1);
    
    storage.clear();
    expect(storage.getImageCount()).toBe(0);
  });
});