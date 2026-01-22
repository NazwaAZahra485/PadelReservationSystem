// client/src/api/index.js
export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...(opts.headers || {}) };

  if (!(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch((import.meta.env.VITE_API_URL || '/api') + path, { ...opts, headers });
  return res;
}