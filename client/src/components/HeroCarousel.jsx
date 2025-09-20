import React from 'react';

// Simple auto-rotating hero slider (no external deps)
const slides = [
  {
    title: 'Find your next home',
    subtitle: 'Discover rentals and properties for sale curated by PJ Agency.',
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=1600&auto=format&fit=crop',
  },
  {
    title: 'Stand out with great marketing',
    subtitle: 'We combine stunning visuals with targeted campaigns to close faster.',
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop',
  },
  {
    title: 'From listing to sold',
    subtitle: 'Full-service marketing for sellers, landlords, and developers.',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop',
  },
];

export default function HeroCarousel() {
  const [active, setActive] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  const heroFallback = "data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'>\
  <defs>\
    <linearGradient id='gg' x1='0' y1='0' x2='1' y2='1'>\
      <stop offset='0%' stop-color='%230f9896'/>\
      <stop offset='100%' stop-color='%230e6b6a'/>\
    </linearGradient>\
  </defs>\
  <rect width='1600' height='900' fill='url(%23gg)'/>\
</svg>";

  return (
    <section className="hero">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`hero__slide ${i === active ? 'is-active' : ''}`}
          aria-hidden={i !== active}
        >
          {/* Use an actual image tag for reliable loading & fallback */}
          <img
            src={s.image}
            alt=""
            onError={(e) => { if (e.currentTarget.src !== heroFallback) e.currentTarget.src = heroFallback; }}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
          />
          <div className="hero__overlay">
            <div className="container hero__content">
              <h1 className="hero__title">{s.title}</h1>
              <p className="hero__subtitle">{s.subtitle}</p>
              <a href="#listings" className="btn btn--light">Browse listings</a>
            </div>
          </div>
        </div>
      ))}
      <div className="hero__dots">
        {slides.map((_, i) => (
          <button key={i} className={`dot ${i === active ? 'is-active' : ''}`} onClick={() => setActive(i)} aria-label={`Go to slide ${i+1}`} />
        ))}
      </div>
    </section>
  );
}