import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Gallery from './pages/Gallery';
import LoginRegister from './pages/LoginRegister';
import PhotoDetail from './pages/PhotoDetail';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Routes>
  <Route path="/" element={<Home />} />

  <Route
    path="/gallery"
    element={
      <ProtectedRoute>
        <Gallery />
      </ProtectedRoute>
    }
  />

  <Route path="/login" element={<LoginRegister />} />
  <Route path="/register" element={<LoginRegister />} />

  <Route
    path="/photos/:id"
    element={
      <ProtectedRoute>
        <PhotoDetail />
      </ProtectedRoute>
    }
  />
</Routes>
  );
}

export default App;