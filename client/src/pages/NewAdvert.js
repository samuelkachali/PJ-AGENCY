import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function NewAdvert() {
  const nav = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title:'', description:'', category:'', price:'', currency:'MWK',
    location:'', contactPhone:'', contactEmail:''
  });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { api.getCategories().then(setCategories).catch(e=>setErr(e.message)); }, []);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setErr('');
    try { await api.createAdvert(form, Array.from(files)); nav('/admin'); }
    catch (e) { setErr(e.message); } finally { setSaving(false); }
  };

  return (
    <div className="container">
      <h2>New Advert</h2>
      <form onSubmit={submit} className="form card" style={{padding:16}}>
        <div className="row" style={{gap:16}}>
          <div style={{flex:2}}>
            <label>Title</label>
            <input name="title" value={form.title} onChange={onChange} required />
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={onChange} required rows={6} />

            <div className="row" style={{gap:12}}>
              <div>
                <label>Category</label>
                <select name="category" value={form.category} onChange={onChange} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label>Price</label>
                <input name="price" type="number" min="0" value={form.price} onChange={onChange} required />
              </div>
              <div>
                <label>Currency</label>
                <select name="currency" value={form.currency} onChange={onChange}>
                  <option>MWK</option><option>USD</option><option>EUR</option>
                </select>
              </div>
            </div>

            <label>Location</label>
            <input name="location" value={form.location} onChange={onChange} required />

            <div className="row" style={{gap:12}}>
              <div>
                <label>Contact Phone</label>
                <input name="contactPhone" value={form.contactPhone} onChange={onChange} required />
              </div>
              <div>
                <label>Contact Email</label>
                <input name="contactEmail" type="email" value={form.contactEmail} onChange={onChange} />
              </div>
            </div>
          </div>

          <div style={{flex:1}}>
            <div className="card" style={{padding:12}}>
              <h3 style={{marginTop:0}}>Images</h3>
              <input type="file" multiple accept="image/*" onChange={(e)=>setFiles(e.target.files)} />
              <p style={{color:'#64748b', fontSize:13}}>Upload multiple images to power the home-page slideshow.</p>
            </div>

            <div className="card" style={{padding:12, marginTop:12}}>
              <h3 style={{marginTop:0}}>Options</h3>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <input id="featured" type="checkbox" onChange={(e)=>setForm({...form, featured: e.target.checked})} />
                <label htmlFor="featured">Mark as Featured</label>
              </div>
            </div>

            <button className="btn btn--primary" disabled={saving} style={{marginTop:12, width:'100%'}}>
              {saving ? 'Saving…' : 'Create advert'}
            </button>
            {err && <div className="error" style={{marginTop:8}}>{err}</div>}
          </div>
        </div>
      </form>
    </div>
  );
}
