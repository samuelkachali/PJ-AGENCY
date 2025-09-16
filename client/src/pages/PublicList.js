import React, { useEffect, useState } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import AdvertCard from '../components/AdvertCard';
const API = process.env.REACT_APP_API || 'http://localhost:5000';

export default function PublicList() {
  const [categories, setCategories] = useState([]);
  const [adverts, setAdverts] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => { fetch(`${API}/api/categories`).then(r=>r.json()).then(setCategories); }, []);
  const fetchAdverts = () => {
    const p = new URLSearchParams();
    if (q) p.append('q', q);
    if (category) p.append('category', category);
    if (status) p.append('status', status);
    fetch(`${API}/api/adverts?${p.toString()}`).then(r=>r.json()).then(setAdverts);
  };
  useEffect(fetchAdverts, []);

  return (
    <div>
      <HeroCarousel />

      <section id="listings" className="container">
        <form onSubmit={(e)=>{e.preventDefault(); fetchAdverts();}} className="card filters">
          <div className="filters__row">
            <input className="input--lg" placeholder="Search by title, location…" value={q} onChange={(e)=>setQ(e.target.value)} />
            <select value={category} onChange={(e)=>setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="">Any status</option>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
            <button type="submit" className="btn btn--primary">Filter</button>
          </div>
        </form>

        <div className="grid grid--cards">
          {adverts.map(a => <AdvertCard key={a._id} advert={a} />)}
        </div>
      </section>
    </div>
  );
}
