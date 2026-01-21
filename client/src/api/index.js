// client/src/api/index.js
export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...(opts.headers || {}), 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch('/api' + path, { ...opts, headers });
  return res;
}