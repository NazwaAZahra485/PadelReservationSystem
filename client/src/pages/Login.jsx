import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Call server login endpoint
      const res = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', res.status);
      
      if (res.ok) {
        const user = await res.json();
        console.log('Login success:', user);
        // Store token and user info
        localStorage.setItem('token', 'token_' + Date.now());
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'admin'
        }));

        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else if (user.role === 'owner') {
          navigate('/owner/dashboard');
        } else {
          navigate('/');
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.log('Login error response:', errorData);
        setErrorMsg(errorData.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Login failed. Server may be unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-holder">
      <h1 id="login-header">Login</h1>

      <div id="login-error-msg-holder">
        {errorMsg && (
          <p id="login-error-msg">
            {errorMsg}
            <span id="error-msg-second-line"></span>
          </p>
        )}
      </div>

      <form id="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          id="email-field"
          className="login-form-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          id="password-field"
          className="login-form-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <input
          type="submit"
          value={loading ? 'Logging in...' : 'Login'}
          id="login-form-submit"
          disabled={loading}
        />
      </form>
      <p style={{ textAlign: 'center', marginTop: 12 }}>
        or <Link to="/public">Continue as Customer</Link>
      </p>
    </main>
  );
}