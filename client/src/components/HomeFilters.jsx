import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API = process.env.REACT_APP_API || (typeof window !== 'undefined' ? window.location.origin : '');

export default function HomeFilters() {
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetch(`${API}/api/categories`).then(r=>r.json()).then(setCategories).catch(()=>setCategories([])); }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q) p.append('q', q);
    if (category) p.append('category', category);
    if (location) p.append('location', location);
    if (minPrice) p.append('minPrice', minPrice);
    if (maxPrice) p.append('maxPrice', maxPrice);
    if (bedrooms) p.append('bedrooms', bedrooms);
    navigate(`/adverts?${p.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="filters card">
      <div className="filters__row filters__row--5">
        <input id="search" name="q" className="input--lg input--search" placeholder="Search title…" aria-label="Search title" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select id="category" name="category" aria-label="Category" value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option value="">All types</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input id="location" name="location" placeholder="Location (e.g., Lilongwe)" aria-label="Location" value={location} onChange={(e)=>setLocation(e.target.value)} />
        <div style={{display:'flex', gap:8}}>
          <input id="minPrice" name="minPrice" placeholder="Min MK" type="number" aria-label="Minimum price" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} />
          <input id="maxPrice" name="maxPrice" placeholder="Max MK" type="number" aria-label="Maximum price" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} />
        </div>
        <div style={{display:'flex', gap:8}}>
          <select id="bedrooms" name="bedrooms" aria-label="Bedrooms" value={bedrooms} onChange={(e)=>setBedrooms(e.target.value)}>
            <option value="">Bedrooms</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
          <button type="submit" className="btn btn--primary">Search</button>
        </div>
      </div>
    </form>
  );
}