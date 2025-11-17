import React, { useState } from 'react';
import { imageAPI } from '../services/api';

const ImageCard = ({ image, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      await imageAPI.deleteImage(image.id);
      onDelete(image.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleConfirmDelete = () => {
    setShowConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setError('');
  };

  const imageUrl = imageAPI.getImageUrl(image.id);

  return (
    <div className="image-card">
      <div className="image-container">
        <img 
          src={imageUrl} 
          alt={image.filename}
          loading="lazy"
          className="gallery-image"
        />
      </div>
      
      <div className="image-info">
        <p className="filename">{image.filename}</p>
        <p className="upload-date">
          Uploaded: {new Date(image.uploadedAt).toLocaleDateString()}
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card-actions">
        {!showConfirm ? (
          <button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="delete-button"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        ) : (
          <div className="confirm-delete">
            <span>Are you sure?</span>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="confirm-button"
            >
              Yes
            </button>
            <button
              onClick={handleCancelDelete}
              disabled={isDeleting}
              className="cancel-button"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;