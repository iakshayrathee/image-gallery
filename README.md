# 🖼️ Mini Image Gallery

A modern, full-stack web application for uploading, viewing, and managing images with a clean, responsive interface. Built with React and Express.js, this application demonstrates best practices in file handling, API design, and user experience.

## ✨ Key Features

### 🎯 Core Functionality
- **📤 Image Upload**: Drag-and-drop or click-to-upload interface with real-time validation
- **🖼️ Image Gallery**: Responsive grid layout that adapts to different screen sizes
- **🗑️ Image Management**: One-click deletion with confirmation dialog for safety
- **🔍 Image Preview**: Visual preview of selected images before uploading

### 🚀 Advanced Features
- **📊 Real-time Progress**: Visual progress bar with percentage indicator during uploads
- **📱 Responsive Design**: Mobile-first design that works seamlessly across all devices
- **⚡ Auto-refresh**: Gallery automatically updates after successful uploads or deletions
- **🛡️ Comprehensive Validation**: Client-side and server-side validation for file type and size

### 🎨 User Experience
- **✨ Modern UI**: Clean, minimalist design with smooth animations
- **📝 Informative Feedback**: Clear error messages and success notifications
- **⚡ Fast Performance**: Optimized image loading and efficient state management
- **🔧 Intuitive Interface**: User-friendly controls with visual feedback

## 🛠️ Technology Stack

### Backend
- **Node.js** with **Express.js** framework
- **Multer** middleware for file upload handling
- **CORS** enabled for frontend communication
- **UUID** for generating unique image identifiers
- In-memory storage (no database required)

### Frontend
- **React 18** with functional components and hooks
- **Axios** for HTTP requests with progress tracking
- **CSS3** with responsive design and modern styling
- No external UI libraries - pure CSS implementation

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** version 16 or higher
- **npm** (comes with Node.js) or **yarn** package manager
- Modern web browser with JavaScript support (Chrome, Firefox, Safari, Edge)
- Git (for version control, optional)

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 500MB free space
- **Internet Connection**: Required for downloading dependencies
- **Permissions**: Read/write access to project directories

## 🚀 Quick Start

### One-Command Setup (Recommended)

```bash
# Clone the repository (if using Git)
git clone <repository-url>
cd markopolo

# Install and start both backend and frontend
npm run setup
```

### Manual Setup

1. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Server runs on http://localhost:5000

2. **Start Frontend** (in new terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```
   App runs on http://localhost:3000

3. **Open your browser** and navigate to http://localhost:3000

## 📁 Project Structure

```
markopolo/
├── backend/                 # Express.js API server
│   ├── __tests__/          # Unit tests
│   ├── middleware/          # Custom middleware
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json
├── frontend/               # React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── styles/         # CSS styles
│   └── package.json
└── README.md               # This file
```

## 🚀 Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

   The backend will run on **http://localhost:5000**

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will run on **http://localhost:3000**

## 📖 API Documentation

### Base URL: `http://localhost:5000/api`

### Endpoints

#### 1. Upload Image
- **POST** `/upload`
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `image` field containing the file
- **Success Response**: `201 Created`
  ```json
  {
    "message": "Image uploaded successfully",
    "image": {
      "id": "uuid-string",
      "filename": "example.jpg",
      "mimeType": "image/jpeg",
      "uploadedAt": "2023-12-01T10:30:00.000Z"
    }
  }
  ```

#### 2. Get All Images
- **GET** `/images`
- **Success Response**: `200 OK`
  ```json
  {
    "images": [
      {
        "id": "uuid-string",
        "filename": "example.jpg",
        "mimeType": "image/jpeg",
        "uploadedAt": "2023-12-01T10:30:00.000Z"
      }
    ]
  }
  ```

#### 3. Get Image by ID
- **GET** `/images/:id`
- **Success Response**: `200 OK` with image binary data
- **Headers**: Proper Content-Type based on image format

#### 4. Delete Image
- **DELETE** `/images/:id`
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Image deleted successfully"
  }
  ```

#### 5. Health Check
- **GET** `/health`
- **Success Response**: `200 OK`
  ```json
  {
    "status": "OK",
    "message": "Server is running"
  }
  ```

### Error Responses

All endpoints return appropriate HTTP status codes:
- `400 Bad Request` - Invalid file type or size
- `404 Not Found` - Image not found
- `500 Internal Server Error` - Server-side errors

## 🎨 Design Choices

### Backend Architecture
- **In-Memory Storage**: Chosen for simplicity and demonstration purposes. Images are stored in a JavaScript Map object, making the application easy to run without database setup.
- **File Validation**: Comprehensive validation including file type (JPEG/PNG only) and size (3MB max) checks.
- **Error Handling**: Custom error middleware with user-friendly error messages.
- **RESTful API**: Clean, predictable API endpoints following REST conventions.

### Frontend Architecture
- **React Hooks**: Uses modern React with useState, useEffect, and useRef hooks for state management.
- **Component Structure**: Modular components (ImageUpload, ImageGallery, ImageCard) for maintainability.
- **Responsive Design**: Mobile-first CSS with flexbox and grid layouts.
- **Progress Tracking**: Axios interceptors for upload progress with visual feedback.
- **User Experience**: Toast notifications, loading states, and confirmation dialogs.

### File Upload Implementation
- **FormData**: Used to send files from frontend to backend.
- **Multer Configuration**: Memory storage with strict file type and size limits.
- **Progress Tracking**: Axios onUploadProgress callback for real-time progress updates.
- **Image Display**: Images served directly from memory buffers with proper content types.

## ⚠️ Limitations

1. **In-Memory Storage**: Images are lost when the server restarts. Not suitable for production.
2. **Single Server**: No clustering or load balancing implemented.
3. **No Authentication**: No user system - all images are publicly accessible.
4. **No Persistence**: No database integration for permanent storage.
5. **Memory Usage**: Large numbers of images will consume significant server memory.
6. **No Image Processing**: No resizing, compression, or EXIF data handling.

## 🚧 Potential Enhancements

1. **Database Integration**: Add MongoDB or PostgreSQL for persistent storage
2. **User Authentication**: Implement user accounts and private galleries
3. **Image Processing**: Add image resizing, compression, and format conversion
4. **Cloud Storage**: Integrate with AWS S3 or Cloudinary for scalable storage
5. **Advanced Search**: Add filtering, sorting, and search functionality
6. **Social Features**: Add likes, comments, and sharing capabilities
7. **Progressive Web App**: Make it installable with service workers
8. **Testing**: Add comprehensive unit and integration tests

## 🧪 Testing

### Backend Testing
Run the test suite:
```bash
cd backend
npm test
```

### Frontend Testing
Run the test suite:
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
mini-image-gallery/
├── backend/
│   ├── routes/
│   │   └── images.js          # Image API routes
│   ├── middleware/
│   │   └── upload.js           # Multer configuration
│   ├── utils/
│   │   └── storage.js          # In-memory storage
│   ├── server.js              # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload.js  # Upload component
│   │   │   ├── ImageGallery.js # Gallery component
│   │   │   └── ImageCard.js    # Individual image card
│   │   ├── services/
│   │   │   └── api.js          # API service layer
│   │   ├── App.js              # Main app component
│   │   ├── App.css             # Global styles
│   │   └── index.js            # React entry point
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the backend and frontend package.json files for details.


## 🙏 Acknowledgments

- Built with Express.js and React
- Icons and styling implemented with pure CSS
- File upload handling with Multer middleware
- Modern JavaScript (ES6+) features throughout