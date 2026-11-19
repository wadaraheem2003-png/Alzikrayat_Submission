import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Gallery.css';

const photos = [
  {
    id: 1,
    title: 'Beautiful Nature',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600'
  },
  {
    id: 2,
    title: 'Mountain View',
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600'
  },
  {
    id: 3,
    title: 'Ocean Memories',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'
  },
  {
    id: 4,
    title: 'City Lights',
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600'
  }
];
function Gallery() {
  const [view, setView] = useState('grid');
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const allPhotos = [
  ...uploadedPhotos.map((photo) => ({
    id: photo._id,
    title: photo.title,
    category: photo.category,
    image: `http://localhost:5000${photo.imageUrl}`
  })),
  ...photos
];
  useEffect(() => {
  const fetchPhotos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/photos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load photos');
      }

      const data = await response.json();
      setUploadedPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  if (token) {
    fetchPhotos();
  }
}, [token]);
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !selectedImage) {
      setMessage('Please enter a title and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://localhost:5000/api/photos/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }
      setUploadedPhotos((prevPhotos) => [result.photo, ...prevPhotos]);
      setMessage('Photo uploaded successfully!');
      setTitle('');
      setDescription('');
      setCategory('Other');
      setSelectedImage(null);
      e.target.reset();

    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="gallery-page">
      <form className="upload-form" onSubmit={handleUpload}>
  <h2>Upload a New Memory</h2>

  <input
    type="text"
    placeholder="Photo Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
  />

  <textarea
    placeholder="Photo Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />

  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >
    <option value="Other">Other</option>
    <option value="Nature">Nature</option>
    <option value="Travel">Travel</option>
    <option value="Family">Family</option>
    <option value="Friends">Friends</option>
  </select>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setSelectedImage(e.target.files[0])}
    required
  />

  <button type="submit">Upload Photo</button>

  {message && <p>{message}</p>}
</form>
      <div className="gallery-header">
        <div>
          <h1>Our Gallery</h1>
          <p>Explore beautiful moments and memories.</p>
        </div>

        <div className="view-buttons">
          <button
            className={view === 'grid' ? 'active' : ''}
            onClick={() => setView('grid')}
          >
            Grid View
          </button>

          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            List View
          </button>
        </div>
      </div>

      <div className={`photo-container ${view}`}>
        {allPhotos.map((photo) => (
          <div className="photo-card" key={photo.id}>
            <img src={photo.image} alt={photo.title} />

            <div className="photo-info">
              <h3>{photo.title}</h3>
              <p>{photo.category}</p>
              <Link to={`/photos/${photo.id}`}>
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;