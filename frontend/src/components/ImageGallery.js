import React, { useState, useEffect } from 'react';
import { imageAPI } from '../services/api';
import ImageCard from './ImageCard';

const ImageGallery = ({ uploadedImage, onImageProcessed }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchImages = async () => {
    try {
      setError('');
      const response = await imageAPI.getImages();
      setImages(response.images || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (uploadedImage) {
      setImages(prevImages => [uploadedImage, ...prevImages]);
      if (onImageProcessed) {
        onImageProcessed();
      }
    }
  }, [uploadedImage, onImageProcessed]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchImages();
  };

  const handleImageUploaded = (newImage) => {
    setImages(prevImages => [newImage, ...prevImages]);
  };

  const handleImageDeleted = (deletedImageId) => {
    setImages(prevImages => 
      prevImages.filter(image => image.id !== deletedImageId)
    );
  };

  if (loading) {
    return (
      <div className="gallery-container">
        <div className="loading">Loading images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-container">
        <div className="error-message">
          Error: {error}
          <button onClick={handleRefresh} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>Image Gallery</h2>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="refresh-button"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {images.length === 0 ? (
        <div className="empty-gallery">
          <p>No images uploaded yet.</p>
          <p>Upload your first image using the form above!</p>
        </div>
      ) : (
        <>
          <p className="image-count">
            {images.length} image{images.length !== 1 ? 's' : ''} found
          </p>
          
          <div className="gallery-grid">
            {images.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onDelete={handleImageDeleted}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageGallery;