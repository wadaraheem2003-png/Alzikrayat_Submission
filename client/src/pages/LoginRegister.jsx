import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css';
import { useAuth } from '../context/AuthContext.jsx';

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setLoading(true);

    try {
      const endpoint = isLogin ? 'login' : 'register';

      const data = {
        email,
        password
      };

      if (!isLogin) {
        data.name = name;
      }

      const response = await fetch(
        `http://localhost:5000/api/auth/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

     if (isLogin) {
  login(result.user, result.token);
  navigate('/');
} else {
  setMessage(result.message);
  setMessageType('success');
}

console.log('User:', result.user);
console.log('Token received:', !!result.token);
    } catch (error) {
      setMessage(error.message || 'Server connection failed');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (loginMode) => {
    setIsLogin(loginMode);
    setMessage('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <h1>Alzikrayat</h1>

        <p className="auth-subtitle">
          Share your beautiful memories
        </p>

        <div className="auth-tabs">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => switchMode(true)}
            type="button"
          >
            Login
          </button>

          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => switchMode(false)}
            type="button"
          >
            Register
          </button>
        </div>

        <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />

          {message && (
            <p className={`auth-message ${messageType}`}>
              {message}
            </p>
          )}

          <button
            className="submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isLogin
                ? 'Login'
                : 'Create Account'}
          </button>

        </form>

        <p className="auth-switch">
          {isLogin
            ? "Don't have an account?"
            : 'Already have an account?'}

          <span onClick={() => switchMode(!isLogin)}>
            {isLogin ? ' Register' : ' Login'}
          </span>
        </p>

      </div>
    </div>
  );
}

export default LoginRegister;