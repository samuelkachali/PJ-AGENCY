import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../api/client';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const { token } = await api.login(email, password);
      setToken(token);
      nav('/admin');
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="container auth">
      <div className="card auth__card">
        <h2 className="auth__title">Welcome back</h2>
        <p className="auth__subtitle">Sign in to manage your adverts</p>
        <form onSubmit={submit}>
          <label>Email</label>
          <input placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
          <label>Password</label>
          <input placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
          {err && <div className="error">{err}</div>}
          <button className="btn btn--primary btn--full" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}
