import React, { useState } from 'react';
const API = process.env.REACT_APP_API || (typeof window !== 'undefined' ? window.location.origin : '');

export default function ContactSection({ bare = false }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setOk(null);
    try {
      const res = await fetch(`${API}/api/leads`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ name, email, phone, message }) });
      const data = await res.json();
      setOk(res.ok && data && (data.ok || data.delivered));
      if (res.ok) { setName(''); setPhone(''); setEmail(''); setMessage(''); }
    } catch (_) { setOk(false); }
    finally { setSending(false); }
  };

  const inner = (
    <div className="grid" style={{gridTemplateColumns:'2fr 1fr'}}>
      <form onSubmit={submit} className="form">
        <div className="row">
          <div>
            <label htmlFor="contactName">Name</label>
            <input id="contactName" name="name" value={name} onChange={(e)=>setName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="contactPhone">Phone</label>
            <input id="contactPhone" name="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          </div>
          <div>
            <label htmlFor="contactEmail">Email</label>
            <input id="contactEmail" name="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
        </div>
        <label htmlFor="contactMessage">Message</label>
        <textarea id="contactMessage" name="message" rows={4} value={message} onChange={(e)=>setMessage(e.target.value)} required />
        <div style={{marginTop:12, display:'flex', gap:8}}>
          <button className="btn btn--primary" disabled={sending}>{sending ? 'Sending…' : 'Send Message'}</button>
          {ok === true && <div className="toast toast--ok">Thanks! We\'ll be in touch.</div>}
          {ok === false && <div className="toast toast--err">Failed to send. Try again.</div>}
        </div>
      </form>
      <aside>
        <div className="card card--tinted">
          <div style={{fontWeight:700, marginBottom:6}}>Quick contacts</div>
          <div style={{display:'grid', gap:6}}>
            <a className="btn btn--light" href="https://wa.me/265999000000" target="_blank" rel="noreferrer">WhatsApp</a>
            <a className="btn btn--light" href="tel:+265999000000">Call us</a>
            <a className="btn btn--light" href="mailto:info@pjagency.mw">info@pjagency.mw</a>
          </div>
          <div className="muted" style={{marginTop:8}}>Office: Lilongwe, Malawi</div>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <a className="btn btn--light" href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a className="btn btn--light" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a className="btn btn--light" href="https://wa.me/265999000000" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </aside>
    </div>
  );

  if (bare) return inner;

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Contact us</h2>
      {inner}
    </div>
  );
}