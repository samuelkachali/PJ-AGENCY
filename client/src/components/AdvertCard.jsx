import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
const API = process.env.REACT_APP_API || (typeof window !== 'undefined' ? window.location.origin : '');

export default function AdvertCard({ advert, enableSlideshow = true, intervalMs = 3000 }) {
  // Normalize image entry to absolute URL supporting multiple shapes
  const toUrl = (img) => {
    const p = typeof img === 'string' ? img : (img?.secure_url || img?.url || img?.path || '');
    if (!p) return '';
    if (p.startsWith('http')) return p;
    const withSlash = p.startsWith('/') ? p : `/${p}`;
    return `${API}${withSlash}`;
  };

  const images = (advert.images || []).map(toUrl).filter(Boolean);
  const fallback = "data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'>\
  <defs>\
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>\
      <stop offset='0%' stop-color='%230f9896'/>\
      <stop offset='100%' stop-color='%230e6b6a'/>\
    </linearGradient>\
  </defs>\
  <rect width='800' height='600' fill='url(%23g)'/>\
  <g fill='white' opacity='0.9'>\
    <path d='M400 150 L600 320 L560 320 L560 470 Q560 490 540 490 L460 490 Q440 490 440 470 L440 400 L360 400 L360 470 Q360 490 340 490 L260 490 Q240 490 240 470 L240 320 L200 320 Z'/>\
  </g>\
</svg>";
  const hasMany = enableSlideshow && images.length > 1;

  const [i, setI] = useState(0); // slideshow index
  const [imgSrc, setImgSrc] = useState(images[0] || fallback); // current image src with fallback
  const timer = useRef(null);

  // Advance slideshow
  useEffect(() => {
    if (!hasMany) return;
    timer.current = setInterval(() => setI(prev => (prev + 1) % images.length), intervalMs);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [hasMany, images.length, intervalMs]);

  // When index or images change, update the rendered src with safe fallback
  useEffect(() => {
    setImgSrc(images[i] || images[0] || fallback);
  }, [i, images]);

  const hasSale = advert.salePrice != null && advert.salePrice >= 0 && advert.salePrice < advert.price;
  const discountPct = hasSale ? Math.round(100 - (advert.salePrice / advert.price) * 100) : 0;

  return (
    <Link to={`/adverts/${advert._id}`} className="card card--hover-lift advert" style={{textDecoration:'none', color:'inherit'}}>
      <div className="advert__media">
        <img
          src={imgSrc}
          alt={advert.title || 'Property image'}
          loading="lazy"
          decoding="async"
          onError={() => { if (imgSrc !== fallback) setImgSrc(fallback); }}
        />
        {advert.status && <span className={`badge ${advert.status}`}>{advert.status}</span>}
        {hasSale && <span className="badge sale">{discountPct}% off</span>}
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
        <div className="advert__meta">{advert.category?.name} • {advert.location}{typeof advert.bedrooms === 'number' && advert.bedrooms >= 0 ? ` • ${advert.bedrooms}-Bedroom` : ''}</div>
        <div className="advert__price">
          {hasSale ? (
            <>
              <span className="price price--strike">{advert.currency} {Number(advert.price).toLocaleString()}</span>
              <span className="price price--sale">Now {advert.currency} {Number(advert.salePrice).toLocaleString()}</span>
            </>
          ) : (
            <span className="price">{advert.currency} {Number(advert.price).toLocaleString()}</span>
          )}
        </div>
        <p className="advert__desc">{(advert.description || '').slice(0, 110)}{(advert.description||'').length>110?'…':''}</p>
        <div style={{marginTop:8}}>
          <span className="btn btn--light">See Details</span>
        </div>
      </div>
    </Link>
  );
}