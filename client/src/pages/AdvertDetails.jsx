import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import emailjs from '@emailjs/browser';

const API = process.env.REACT_APP_API || (typeof window !== 'undefined' ? window.location.origin : '');
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

export default function AdvertDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [lightbox, setLightbox] = useState(-1);

  useEffect(() => {
    setLoading(true);
    api.getAdvert(id).then(setData).catch(e=>setErr(e.message)).finally(()=>setLoading(false));
  }, [id]);

  if (loading) return <div className="container"><div className="card">Loading…</div></div>;
  if (err) return <div className="container"><div className="card error">{err}</div></div>;
  if (!data) return null;

  const images = data.images?.length ? data.images.map(i => (i.path?.startsWith('http') ? i.path : `${API}${i.path}`)) : [];
  const hasSale = data.salePrice != null && data.salePrice >= 0 && data.salePrice < data.price;
  const discountPct = hasSale ? Math.round(100 - (data.salePrice / data.price) * 100) : 0;

  return (
    <div className="container">
      <div className="grid detail-grid">
        <div className="card">
          {/* Show all images stacked for details */}
          <div className="grid" style={{gridTemplateColumns:'1fr', gap:12}}>
            {images.length ? images.map((src, idx) => (
              <div key={idx} className="advert__media advert__media--details" onClick={()=>setLightbox(idx)}>
                <img loading="lazy" src={src} alt={`image-${idx}`} />
              </div>
            )) : (
              <div className="advert__media advert__media--details">
                <img loading="lazy" alt="placeholder" src="https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop"/>
              </div>
            )}
          </div>
          <h1 style={{margin:'12px 0 6px', display:'flex', alignItems:'center', gap:10}}>
            {data.title}
            {hasSale && <span className="badge sale" style={{position:'static'}}>{discountPct}% off</span>}
          </h1>
          <div style={{color:'#64748b'}}>{data.category?.name} • {data.location}</div>
          <div className="advert__price" style={{fontSize:20}}>
            {hasSale ? (
              <>
                <span className="price--strike">{data.currency} {Number(data.price).toLocaleString()}</span>
                <span className="price--sale">Now {data.currency} {Number(data.salePrice).toLocaleString()}</span>
              </>
            ) : (
              <span className="price">{data.currency} {Number(data.price).toLocaleString()}</span>
            )}
          </div>

          {/* Share bar */}
          <div className="sharebar" style={{display:'flex', gap:8, marginTop:8, flexWrap:'wrap'}}>
            <button className="btn btn--light" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              const root = document.getElementById('toast-root');
              if (root){
                const el = document.createElement('div');
                el.className = 'toast toast--ok';
                el.innerHTML = '<span class="toast__icon">✅</span> Link copied';
                root.appendChild(el);
                setTimeout(()=> root.removeChild(el), 2200);
              }
            }}>
              <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copy link
            </button>
            <a className="btn btn--light" href={`https://wa.me/?text=${encodeURIComponent(`${data.title} - ${window.location.href}`)}`} target="_blank" rel="noreferrer">
              <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.76 11.76 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.09 1.52 5.8L0 24l6.4-1.68A12 12 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.18-1.24-6.18-3.48-8.52zM12 22c-1.9 0-3.67-.5-5.2-1.38l-.37-.21-3.08.81.82-3.01-.24-.39A9.96 9.96 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.43-7.57c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.69.15-.2.3-.8.97-.99 1.17-.18.2-.36.22-.66.07-.3-.15-1.26-.47-2.4-1.5-.89-.78-1.49-1.74-1.66-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.69-1.65-.95-2.26-.25-.6-.5-.52-.69-.53-.18 0-.37-.01-.57-.01s-.52.07-.79.37c-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.1 4.49.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35z"/></svg>
              Share
            </a>
            <a className="btn btn--light" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer">
              <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.08 5.66 21.2 10.44 22v-7.03H7.9v-2.9h2.54V9.84c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.9h-2.33V22C18.34 21.2 22 17.08 22 12.07z"/></svg>
              Share
            </a>
            <a className="btn btn--primary" href={`https://wa.me/265997330912?text=${encodeURIComponent(`Hello, I'm interested in "${data.title}" - ${window.location.href}`)}`} target="_blank" rel="noreferrer">
              <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Mini map */}
          {data.location && (
            <div className="card" style={{marginTop:12, padding:0, overflow:'hidden'}}>
              <iframe
                title="map"
                width="100%"
                height="220"
                style={{border:0, display:'block'}}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${encodeURIComponent(data.location)}&output=embed`}
              />
            </div>
          )}

          <p style={{marginTop:16, lineHeight:1.65}}>{data.description}</p>
        </div>
        <div>
          <LeadForm advertId={data._id} advertTitle={data.title} />
        </div>
      </div>

      {/* Lightbox overlay */}
      {lightbox >= 0 && (
        <div role="dialog" aria-modal="true" className="lightbox" onClick={()=>setLightbox(-1)}>
          <img src={images[lightbox]} alt={`image-${lightbox}`} />
        </div>
      )}
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