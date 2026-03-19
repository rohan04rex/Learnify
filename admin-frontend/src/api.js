// Shared API utility for the admin dashboard
const API_BASE = 'http://localhost:5000/api';

export function getToken() {
  return localStorage.getItem('admin_token');
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export default apiFetch;
