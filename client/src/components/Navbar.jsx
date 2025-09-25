import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // adjust threshold as needed
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`nav ${open ? 'is-open' : ''} ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__brand" onClick={() => setOpen(false)}>
          <span className="nav__logo">PJ</span>
          <span className="nav__title">Agency</span>
        </Link>

        <button
          className="nav__toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span style={{
            display:'inline-block',
            width:18,
            height:2,
            background:'var(--pj-ink)',
            boxShadow:'0 6px 0 var(--pj-ink), 0 12px 0 var(--pj-ink)'
          }} />
        </button>

        <nav id="primary-nav" className="nav__links" onClick={() => setOpen(false)}>
          <Link className={`nav__link ${isActive('/') ? 'is-active' : ''}`} to="/">Home</Link>
          <Link className={`nav__link ${isActive('/adverts') ? 'is-active' : ''}`} to="/adverts">Adverts</Link>
          <Link className={`nav__link ${isActive('/login') ? 'is-active' : ''}`} to="/login">Login</Link>
          <Link className="btn btn--primary" to="/list-property">List your property</Link>
        </nav>
      </div>
    </header>
  );
}
