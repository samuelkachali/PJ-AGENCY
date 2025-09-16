import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
const API = process.env.REACT_APP_API || 'http://localhost:5000';

export default function AdvertCard({ advert, enableSlideshow = true, intervalMs = 3000 }) {
  const images = (advert.images || []).map(i => `${API}${i.path}`);
  const fallback = 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop';
  const hasMany = enableSlideshow && images.length > 1;

  const [i, setI] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!hasMany) return;
    timer.current = setInterval(() => setI(prev => (prev + 1) % images.length), intervalMs);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [hasMany, images.length, intervalMs]);

  const cover = images[i] || images[0] || fallback;

  return (
    <Link to={`/adverts/${advert._id}`} className="card card--hover advert" style={{textDecoration:'none', color:'inherit'}}>
      <div className="advert__media">
        <img src={cover} alt={advert.title} />
        {advert.status && <span className={`badge ${advert.status}`}>{advert.status}</span>}
        {hasMany && (
          <div style={{position:'absolute', bottom:8, right:8, display:'flex', gap:4}}>
            {images.map((_, idx) => (
              <span key={idx} style={{width:6, height:6, borderRadius:3, background: idx===i ? '#fff' : 'rgba(255,255,255,0.5)'}} />
            ))}
          </div>
        )}
      </div>
      <div className="advert__body">
        <h3 className="advert__title">{advert.title}</h3>
        <div className="advert__meta">{advert.category?.name} • {advert.location}</div>
        <div className="advert__price">{advert.currency} {Number(advert.price).toLocaleString()}</div>
        <p className="advert__desc">{(advert.description || '').slice(0, 110)}{(advert.description||'').length>110?'…':''}</p>
      </div>
    </Link>
  );
}