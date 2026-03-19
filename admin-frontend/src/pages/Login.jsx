import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Lock, User } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const Login = () => {
  const [email, setEmail] = useState('admin@learnify.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        // Store JWT for future API calls
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        login();
        navigate('/');
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch {
      setError('Cannot connect to the API server. Make sure Node API is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light font-sans">
      <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-1 text-dark">Learnify Admin</h2>
          <p className="text-muted small mb-0">Sign in to manage your dashboard</p>
        </div>

        {error && <div className="alert alert-danger py-2 font-sans small border-0 rounded-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative">
            <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
              <User size={18} />
            </span>
            <input
              type="email"
              className="form-control rounded-pill ps-5 py-2 bg-light border-0"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 position-relative">
            <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
              <Lock size={18} />
            </span>
            <input
              type="password"
              className="form-control rounded-pill ps-5 py-2 bg-light border-0"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark w-100 rounded-pill py-2 fw-semibold" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2" role="status" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center mt-3">
            <span className="text-muted small">Use your admin credentials from the database</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
