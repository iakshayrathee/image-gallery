import React, { useState, useRef } from 'react';
import { imageAPI } from '../services/api';

const ImageUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  const validateFile = (file) => {
    if (!file) {
      return 'Please select a file';
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Only JPEG and PNG images are allowed';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 3MB';
    }

    return '';
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setError('');
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const response = await imageAPI.uploadImage(
        selectedFile,
        (progress) => setUploadProgress(progress)
      );

      // Reset form
      setSelectedFile(null);
      setPreviewUrl('');
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(response.image);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload">
      <h2>Upload Image</h2>
      
      <div className="upload-container">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="file-input"
        />
        
        {previewUrl && (
          <div className="preview-container">
            <img src={previewUrl} alt="Preview" className="preview-image" />
            <p className="file-name">{selectedFile.name}</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="upload-controls">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="upload-button"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
          
          {selectedFile && !isUploading && (
            <button
              onClick={handleClearSelection}
              className="clear-button"
            >
              Clear
            </button>
          )}
        </div>

        {isUploading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="progress-text">{uploadProgress}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;