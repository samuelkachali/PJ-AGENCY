import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="nav">
      <div className="nav__inner container">
        <Link to="/" className="nav__brand">
          <span className="nav__logo">PJ</span>
          <span className="nav__title">Agency</span>
        </Link>
        <nav className="nav__links">
          <Link className={`nav__link ${pathname === '/' ? 'is-active' : ''}`} to="/">Home</Link>
          <Link className={`nav__link ${pathname.startsWith('/adverts') ? 'is-active' : ''}`} to="/adverts">Adverts</Link>
          <Link className={`nav__link ${pathname.startsWith('/login') ? 'is-active' : ''}`} to="/login">Login</Link>
          <Link className="btn btn--primary" to="/list-property">List your property</Link>
        </nav>
      </div>
    </header>
  );
}