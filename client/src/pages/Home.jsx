import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Home.css';

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h2>Alzikrayat</h2>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>

          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Every Picture Tells a Story</h1>

          <p>
            Welcome to Alzikrayat, a place where
            memories live forever. Share your special
            moments and explore beautiful memories.
          </p>

          <Link to="/gallery" className="hero-button">
            Explore Gallery
          </Link>
        </div>
      </section>

      <section className="about-section">
        <h2>About Alzikrayat</h2>
        <p>
          Alzikrayat is a photo sharing platform
          where people can upload, explore and share
          their favorite memories with others.
        </p>
      </section>

      <footer>
        <p>© 2026 Alzikrayat - Share Your Memories</p>
      </footer>
    </div>
  );
}

export default Home;