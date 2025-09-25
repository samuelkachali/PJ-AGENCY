import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import AdvertCard from '../components/AdvertCard';
import HomeFilters from '../components/HomeFilters';
import ContactSection from '../components/ContactSection';

const API = process.env.REACT_APP_API || (typeof window !== 'undefined' ? window.location.origin : '');

// Inline SVG icons (stroke inherits currentColor)
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10z" />
    <circle cx="12" cy="11" r="2.5" />
  </svg>
);
const IconFlame = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.5 14.5a2.5 2.5 0 1 1-5 0c0-1.5 1.5-3 3-4.5 1 1 2 2 2 4.5z" />
    <path d="M12 2s4 3 4 7.5S14 20 12 20s-4-3.5-4-10.5C8 5 12 2 12 2z" />
  </svg>
);

export default function Home() {
  const [hot, setHot] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    // Load Hot Deals first (salePrice <= 50% or isHot = true)
    fetch(`${API}/api/adverts?hot=true&status=active`)
      .then(r => r.json())
      .then(list => setHot((list || []).slice(0, 8)))
      .catch(() => setHot([]));

    // Fetch featured adverts, fallback to latest
    fetch(`${API}/api/adverts?featured=true&status=active`)
      .then(r => r.json())
      .then(items => {
        if (Array.isArray(items) && items.length) {
          setFeatured(items.slice(0, 8));
        } else {
          fetch(`${API}/api/adverts?status=active`)
            .then(r => r.json())
            .then(list => setLatest((list || []).slice(0, 12)))
            .catch(() => setLatest([]));
        }
      })
      .catch(() => {
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

      {/* Search/Filters Bar */}
      <section className="container filters">
        <HomeFilters />
      </section>

      {hot.length > 0 && (
        <section className="container section section--alt">
          <div className="section__header">
            <span className="kicker"><span className="icon" aria-hidden="true" style={{lineHeight:0}}><IconFlame /></span> <span style={{color:'#ef4444'}}>Hot Deals</span></span>
            <span className="section__subtitle">Discounted land and houses currently on promotion.</span>
          </div>
          <div className="card card--glass section--mesh">
            <h2 className="section__title" style={{marginTop:0, color:'#6b7280'}}>Up to 50% Off</h2>
            <div className="grid grid--cards" style={{marginTop: 12}}>
              {hot.map(a => (
                <AdvertCard key={a._id} advert={a} enableSlideshow={true} intervalMs={2200} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured/Latest Section */}
      <section className="container section section--tealTint">
        <div className="section__header">
          <span className="kicker"><span className="icon" aria-hidden="true" style={{lineHeight:0}}>{hasFeatured ? <IconCheck/> : <IconHome/>}</span> {hasFeatured ? 'Featured' : 'Latest'}</span>
          <span className="section__subtitle">Browse {hasFeatured ? 'hand-picked' : 'recently uploaded'} listings from the admin.</span>
        </div>
        <div className="card card--glass section--tealTint">
          <h2 className="section__title" style={{marginTop:0}}>{hasFeatured ? 'Featured Adverts' : 'Latest Adverts'}</h2>
          <div className="grid grid--cards" style={{marginTop: 12}}>
            {(hasFeatured ? featured : latest).map(a => (
              <AdvertCard key={a._id} advert={a} enableSlideshow={true} intervalMs={2500} />
            ))}
          </div>
          <div style={{display:'flex', justifyContent:'center', marginTop: 16}}>
            <Link to="/adverts" className="btn btn--primary">View all adverts</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us / About */}
      <section className="container section section--mint">
        <div className="section__header">
          <span className="kicker">Why Choose Us</span>
          <span className="section__subtitle">Trusted. Verified. In prime locations.</span>
        </div>
        <div className="card card--glass section--mint">
          <h2 className="section__title" style={{marginTop:0}}>Why Choose PJ Agency</h2>
          <div className="features" style={{marginTop:12}}>
            <div className="feature">
              <div className="feature__icon icon" aria-hidden="true"><IconHome /></div>
              <div className="feature__body">
                <div className="feature__title">Trusted by 200+ families</div>
                <p className="feature__text">Real clients, real homes, real results.</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature__icon icon" aria-hidden="true"><IconCheck /></div>
              <div className="feature__body">
                <div className="feature__title">Verified & affordable listings</div>
                <p className="feature__text">Every property is reviewed by our agents.</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature__icon icon" aria-hidden="true"><IconPin /></div>
              <div className="feature__body">
                <div className="feature__title">Prime locations</div>
                <p className="feature__text">Houses and plots in sought‑after areas.</p>
              </div>
            </div>
          </div>
          {/* Removed About PJ Agency blurb per request */}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container section section--sand">
        <div className="section__header">
          <span className="kicker">Testimonials</span>
        </div>
        <div className="section--sand">
          <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))'}}>
            <blockquote className="card card--tinted alt card--hover-lift" style={{margin:0}}>
              “Thanks to PJ Agency, I bought a plot in Area 25 hassle-free.”
              <footer style={{marginTop:8, color:'#64748b'}}>— Mr Phiri</footer>
            </blockquote>

            <blockquote className="card card--tinted alt card--hover-lift" style={{margin:0}}>
              “Professional and responsive team. Sold my house quickly.”
              <footer style={{marginTop:8, color:'#64748b'}}>— PJAGENCY</footer>
            </blockquote>

            <blockquote className="card card--tinted alt card--hover-lift" style={{margin:0}}>
              “Found a great rental in Lilongwe within days.”
              <footer style={{marginTop:8, color:'#64748b'}}>— Chikumbutso Banda</footer>
            </blockquote>

          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="container section">
        <div className="section--cta">
          <div>
            <h3 style={{margin:'0 0 6px', color:'rgb(154, 166, 157)'}}>Looking for a house, land, or rental? <span style={{color:'#fff', fontSize: '12.5px'}}>Let us help you today.</span></h3>
            {/* <div style={{opacity:.9}}>Talk to our agent for personalized recommendations.</div> */}
          </div>
          <button type="button" className="btn btn--primary" onClick={() => setShowContact(true)}>Talk to an Agent</button>
        </div>
      </section>

      {/* Contact Modal */}
      {showContact && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setShowContact(false)}>
          <div className="card" style={{maxWidth:840, width:'100%'}} onClick={(e)=>e.stopPropagation()}>
            <div className="topbar">
              <h3 style={{margin:0}}>Contact us</h3>
              <button className="btn btn--light" onClick={() => setShowContact(false)}>Close</button>
            </div>
            <ContactSection />
          </div>
        </div>
      )}
    </div>
  );
}