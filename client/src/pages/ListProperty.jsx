import React, { useState } from 'react';
const API = process.env.REACT_APP_API || 'http://localhost:5000';

export default function ListProperty() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    location: '',
    price: '',
    details: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setSending(true); setErr(''); setSent(false);
    try {
      const message = `New property submission\n\nTitle: ${form.title}\nLocation: ${form.location}\nPrice: ${form.price || '-'}\n\nDetails:\n${form.details}`;
      const res = await fetch(`${API}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name || 'Anonymous',
          email: form.email,
          phone: form.phone,
          message
        })
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to send');
      setSent(true);
      setForm({ name: '', email: '', phone: '', title: '', location: '', price: '', details: '' });
    } catch (e) { setErr(e.message); } finally { setSending(false); }
  };

  return (
    <div className="container" style={{minHeight:'60vh'}}>
      <div className="card" style={{maxWidth:760, margin:'20px auto'}}>
        <h2 style={{marginTop:0}}>List your property</h2>
        <p className="muted" style={{marginTop:4}}>Tell us about your land or house. We will contact you to complete the listing.</p>
        <form onSubmit={submit} className="form" style={{marginTop:12}}>
          <div className="row" style={{gap:12}}>
            <div>
              <label>Your name</label>
              <input name="name" value={form.name} onChange={onChange} required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={onChange} />
            </div>
            <div>
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={onChange} />
            </div>
          </div>

          <label>Property title</label>
          <input name="title" placeholder="e.g., 3-bedroom house in Lilongwe" value={form.title} onChange={onChange} required />

          <div className="row" style={{gap:12}}>
            <div>
              <label>Location</label>
              <input name="location" value={form.location} onChange={onChange} required />
            </div>
            <div>
              <label>Expected price (optional)</label>
              <input name="price" type="text" value={form.price} onChange={onChange} />
            </div>
          </div>

          <label>Details</label>
          <textarea name="details" rows={6} placeholder="Describe land size, house features, nearby amenities, title deed status, etc." value={form.details} onChange={onChange} required />

          {err && <div className="error">{err}</div>}
          {sent && <div className="card" style={{marginTop:12, background:'#ecfdf5', color:'#065f46'}}>Thanks! Your submission has been sent. We will reach you soon.</div>}
          <button disabled={sending} className="btn btn--primary" style={{marginTop:12}}>
            {sending ? 'Sending…' : 'Send to admin'}
          </button>
        </form>
      </div>
    </div>
  );
}