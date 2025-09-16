import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <div className="nav__brand">
            <span className="nav__logo">PJ</span>
            <span className="nav__title">Agency</span>
          </div>
          <p className="footer__tag">Marketing that moves properties.</p>
        </div>
        <div className="footer__links">
          <a href="/adverts">Adverts</a>
          <a href="/login">Admin</a>
          <a href="#">Contact</a>
        </div>
      </div>
      <div className="footer__bottom">© {new Date().getFullYear()} PJ Agency. All rights reserved.</div>
    </footer>
  );
}