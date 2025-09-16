import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import emailjs from '@emailjs/browser';

const API = process.env.REACT_APP_API || 'http://localhost:5000';
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

export default function AdvertDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getAdvert(id).then(setData).catch(e=>setErr(e.message)).finally(()=>setLoading(false));
  }, [id]);

  if (loading) return <div className="container"><div className="card">Loading…</div></div>;
  if (err) return <div className="container"><div className="card error">{err}</div></div>;
  if (!data) return null;

  const images = data.images?.length ? data.images.map(i => `${API}${i.path}`) : [];

  return (
    <div className="container">
      <div className="grid" style={{gridTemplateColumns: '2fr 1fr'}}>
        <div className="card">
          {/* Show all images stacked for details */}
          <div className="grid" style={{gridTemplateColumns:'1fr', gap:12}}>
            {images.length ? images.map((src, idx) => (
              <div key={idx} className="advert__media" style={{height:360}}>
                <img src={src} alt={`image-${idx}`} />
              </div>
            )) : (
              <div className="advert__media" style={{height:320}}>
                <img alt="placeholder" src="https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop"/>
              </div>
            )}
          </div>
          <h1 style={{margin:'12px 0 6px'}}>{data.title}</h1>
          <div style={{color:'#64748b'}}>{data.category?.name} • {data.location}</div>
          <div style={{marginTop:12, fontWeight:800, fontSize:20}}>{data.currency} {Number(data.price).toLocaleString()}</div>
          <p style={{marginTop:16, lineHeight:1.65}}>{data.description}</p>
        </div>
        <div>
          <LeadForm advertId={data._id} advertTitle={data.title} />
        </div>
      </div>
    </div>
  );
}

function Gallery({ images }){
  const [i, setI] = useState(0);
  if (!images.length) return (
    <div className="advert__media" style={{height:320}}>
      <img alt="placeholder" src="https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop"/>
    </div>
  );
  return (
    <div>
      <div className="advert__media" style={{height:360}}>
        <img src={images[i]} alt={"image-"+i} />
      </div>
      {images.length>1 && (
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', marginTop:12}}>
          {images.map((src, idx)=> (
            <button key={idx} className={`thumb ${idx===i?'is-active':''}`} onClick={()=>setI(idx)}>
              <img src={src} alt={'thumb-'+idx} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LeadForm({ advertId, advertTitle }){
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setSending(true); setOk(''); setErr('');
    try {
      // Send via EmailJS (client-side)
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        advertId,
        advertTitle
      }, { publicKey: EMAILJS_PUBLIC_KEY });
      setOk('Message sent! We will get back to you.');
      setForm({ name:'', email:'', phone:'', message:'' });
    } catch(e) {
      setErr('Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card" id="contact">
      <h3>Enquire about this property</h3>
      <form onSubmit={submit}>
        <label>Name</label>
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <label>Email</label>
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} type="email" placeholder="optional" />
        <label>Phone</label>
        <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="optional" />
        <label>Message</label>
        <textarea rows={4} value={form.message} onChange={e=>setForm({...form, message:e.target.value})} required />
        {ok && <div style={{color:'#0a7f6d', marginTop:8}}>{ok}</div>}
        {err && <div className="error">{err}</div>}
        <button className="btn btn--primary btn--full" disabled={sending}>{sending?'Sending…':'Send enquiry'}</button>
      </form>
    </div>
  );
}