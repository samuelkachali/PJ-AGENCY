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
        <div className="footer__links" style={{display:'grid', gap:6}}>
          <div style={{display:'flex', gap:16}}>
            <a href="/">Home</a>
            <a href="/adverts">Properties</a>
            <a href="#contact">Contact</a>
            <a href="/login">Admin</a>
          </div>
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <span>+265 999 000 000</span>
            <a href="mailto:info@pjagency.mw">info@pjagency.mw</a>
            <div style={{display:'flex', gap:8}}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://wa.me/265999000000" target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">© {new Date().getFullYear()} PJ Agency. All rights reserved.</div>
    </footer>
  );
}