import axios from 'axios';

const API_BASE_URL = 'https://image-gallery-g8k2.onrender.com/api' || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Image API service
export const imageAPI = {
  // Upload an image
  uploadImage: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },

  // Get all images
  getImages: async () => {
    const response = await api.get('/images');
    return response.data;
  },

  // Get image URL
  getImageUrl: (id) => {
    return `${API_BASE_URL}/images/${id}`;
  },

  // Delete an image
  deleteImage: async (id) => {
    const response = await api.delete(`/images/${id}`);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend server is not responding');
    }
  },
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
);

export default api;