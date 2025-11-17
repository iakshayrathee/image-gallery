import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ImageGallery from './components/ImageGallery';
import './App.css';

function App() {
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [uploadedImage, setUploadedImage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleUploadSuccess = (image) => {
    showToast(`Image "${image.filename}" uploaded successfully!`, 'success');
    setUploadedImage(image);
  };

  const handleImageProcessed = () => {
    setUploadedImage(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Mini Image Gallery</h1>
        <p>Upload and manage your images</p>
      </header>

      <main className="app-main">
        <ImageUpload onUploadSuccess={handleUploadSuccess} />
        <ImageGallery 
          uploadedImage={uploadedImage}
          onImageProcessed={handleImageProcessed}
        />
      </main>

      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;