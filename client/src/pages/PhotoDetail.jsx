import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PhotoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
const [editTitle, setEditTitle] = useState('');
const [editDescription, setEditDescription] = useState('');
const [editCategory, setEditCategory] = useState('');

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/photos',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load photo');
        }

        const foundPhoto = data.find(
          (item) => item._id === id
        );

        if (!foundPhoto) {
          throw new Error('Photo not found');
        }

        setPhoto(foundPhoto);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPhoto();
    }
  }, [id, token]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this photo?'
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Delete failed');
      }

      navigate('/gallery');
    } catch (error) {
      setMessage(error.message);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
            category: editCategory
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Update failed');
      }

      setPhoto(result.photo);
      setIsEditing(false);
      setMessage('Photo updated successfully');
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return <p>Loading photo...</p>;
  }

  if (!photo) {
    return <p>{message || 'Photo not found'}</p>;
  }

  return (
    <div className="photo-detail">
      {isEditing ? (
  <form onSubmit={handleUpdate}>
    <input
      type="text"
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
      placeholder="Photo title"
      required
    />

    <textarea
      value={editDescription}
      onChange={(e) => setEditDescription(e.target.value)}
      placeholder="Photo description"
    />

    <input
      type="text"
      value={editCategory}
      onChange={(e) => setEditCategory(e.target.value)}
      placeholder="Photo category"
    />

    <button type="submit">Save Changes</button>

    <button
      type="button"
      onClick={() => setIsEditing(false)}
    >
      Cancel
    </button>
  </form>
) : (
  <h1>{photo.title}</h1>
)}
      <img
        src={`http://localhost:5000${photo.imageUrl}`}
        alt={photo.title}
        style={{ maxWidth: '100%' }}
      />

      <p>{photo.description}</p>
      <p>Category: {photo.category}</p>

      {message && <p>{message}</p>}
      {!isEditing && (
  <button
    onClick={() => {
      setEditTitle(photo.title);
      setEditDescription(photo.description);
      setEditCategory(photo.category);
      setIsEditing(true);
    }}
  >
    Edit Photo
  </button>
)}
      <button onClick={handleDelete}>
        Delete Photo
      </button>
    </div>
  );
}

export default PhotoDetail;