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

  return (
    <section className="hero">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`hero__slide ${i === active ? 'is-active' : ''}`}
          style={{ backgroundImage: `url(${s.image})` }}
          aria-hidden={i !== active}
        >
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