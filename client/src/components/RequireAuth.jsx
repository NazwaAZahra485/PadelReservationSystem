// client/src/components/RequireAuth.jsx
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children, role = 'admin' }) {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  if (!token || !userRaw) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userRaw);
    // Verify role matches what's required
    if (user.role === role) {
      return children;
    }
  } catch (e) {
    // invalid user data
  }

  // fallback: clear any partial auth and redirect
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return <Navigate to="/login" replace />;
}