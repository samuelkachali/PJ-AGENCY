import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import AdvertCard from '../components/AdvertCard';

const API = process.env.REACT_APP_API || 'http://localhost:5000';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    // Fetch featured adverts first; if none, fallback to latest active
    fetch(`${API}/api/adverts?featured=true&status=active`)
      .then(r => r.json())
      .then(items => {
        if (Array.isArray(items) && items.length) {
          setFeatured(items.slice(0, 8));
        } else {
          // Fallback: latest active adverts
          fetch(`${API}/api/adverts?status=active`)
            .then(r => r.json())
            .then(list => setLatest((list || []).slice(0, 12)))
            .catch(() => setLatest([]));
        }
      })
      .catch(() => {
        // If featured fetch fails, try latest
        fetch(`${API}/api/adverts?status=active`)
          .then(r => r.json())
          .then(list => setLatest((list || []).slice(0, 12)))
          .catch(() => setLatest([]));
      });
  }, []);

  const hasFeatured = featured.length > 0;

  return (
    <div>
      <HeroCarousel />

      <section className="container" style={{marginTop: 24}}>
        <div className="card" style={{padding: 16}}>
          <h2 style={{margin: 0}}>{hasFeatured ? 'Featured Adverts' : 'Latest Adverts'}</h2>
          <p style={{color:'#64748b', marginTop: 6}}>
            Browse {hasFeatured ? 'hand-picked' : 'recently uploaded'} listings from the admin.
          </p>
        </div>

        <div className="grid grid--cards" style={{marginTop: 16}}>
          {(hasFeatured ? featured : latest).map(a => (
            <AdvertCard key={a._id} advert={a} enableSlideshow={true} intervalMs={2500} />
          ))}
        </div>

        <div style={{display:'flex', justifyContent:'center', marginTop: 20}}>
          <Link to="/adverts" className="btn btn--primary">View all adverts</Link>
        </div>
      </section>
    </div>
  );
}