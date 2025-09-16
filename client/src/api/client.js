const API_BASE = process.env.REACT_APP_API || 'http://localhost:5000';
export const getToken = () => localStorage.getItem('pj_token');
export const setToken = (t) => localStorage.setItem('pj_token', t);
export const clearToken = () => localStorage.removeItem('pj_token');

export const api = {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
    return res.json();
  },
  async getCategories() {
    const res = await fetch(`${API_BASE}/api/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },
  async getAdverts(params = {}) {
    const p = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/api/adverts${p ? `?${p}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch adverts');
    return res.json();
  },
  async getAdvert(id) {
    const res = await fetch(`${API_BASE}/api/adverts/${id}`);
    if (!res.ok) throw new Error('Advert not found');
    return res.json();
  },
  async createAdvert(data, files) {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => form.append(k, v));
    (files || []).forEach((f) => form.append('images', f));
    const res = await fetch(`${API_BASE}/api/adverts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: form
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to create advert');
    return res.json();
  },
  async updateAdvert(id, data) {
    const res = await fetch(`${API_BASE}/api/adverts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to update advert');
    return res.json();
  },
  async deleteAdvert(id) {
    const res = await fetch(`${API_BASE}/api/adverts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete advert');
    return res.json();
  },
  async createLead(payload) {
    const res = await fetch(`${API_BASE}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to send message');
    return res.json();
  }
};
