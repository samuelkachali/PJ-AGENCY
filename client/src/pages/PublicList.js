import React, { useEffect, useMemo, useState } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import AdvertCard from '../components/AdvertCard';
const API = process.env.REACT_APP_API || (typeof window !== 'undefined' ? window.location.origin : '');

export default function PublicList() {
  const [categories, setCategories] = useState([]);
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => { fetch(`${API}/api/categories`).then(r=>r.json()).then(setCategories); }, [API]);
  const fetchAdverts = () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.append('q', q);
    if (category) p.append('category', category);
    if (status) p.append('status', status);
    if (location) p.append('location', location);
    if (minPrice) p.append('minPrice', minPrice);
    if (maxPrice) p.append('maxPrice', maxPrice);
    if (bedrooms) p.append('bedrooms', bedrooms);
    fetch(`${API}/api/adverts?${p.toString()}`)
      .then(r=>r.json())
      .then(list => setAdverts(Array.isArray(list)? list : []))
      .finally(()=>setLoading(false));
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQ(params.get('q') || '');
    setCategory(params.get('category') || '');
    setStatus(params.get('status') || '');
    setLocation(params.get('location') || '');
    setMinPrice(params.get('minPrice') || '');
    setMaxPrice(params.get('maxPrice') || '');
    setBedrooms(params.get('bedrooms') || '');
    fetchAdverts();
    // eslint-disable-next-line
  }, []);

  const sorted = useMemo(() => {
    const list = [...adverts];
    switch (sort) {
      case 'price-asc': return list.sort((a,b)=> (a.salePrice??a.price) - (b.salePrice??b.price));
      case 'price-desc': return list.sort((a,b)=> (b.salePrice??b.price) - (a.salePrice??a.price));
      default: return list.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [adverts, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = sorted.slice((page-1)*pageSize, page*pageSize);

  return (
    <div>
      <HeroCarousel />

      <section id="listings" className="container">
        <form onSubmit={(e)=>{e.preventDefault(); setPage(1); fetchAdverts();}} className="card card--tinted filters">
          <div className="filters__row filters__row--5">
            <input className="input--lg" placeholder="Search title…" value={q} onChange={(e)=>setQ(e.target.value)} />
            <select value={category} onChange={(e)=>setCategory(e.target.value)}>
              <option value="">All types</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input placeholder="Location (e.g., Lilongwe)" value={location} onChange={(e)=>setLocation(e.target.value)} />
            <div style={{display:'flex', gap:8}}>
              <input placeholder="Min MK" type="number" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} />
              <input placeholder="Max MK" type="number" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} />
            </div>
            <div style={{display:'flex', gap:8}}>
              <select value={bedrooms} onChange={(e)=>setBedrooms(e.target.value)}>
                <option value="">Bedrooms</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
              <select value={status} onChange={(e)=>setStatus(e.target.value)}>
                <option value="">Any status</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
              <select value={sort} onChange={(e)=>{setSort(e.target.value); setPage(1);}}>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
            <button type="submit" className="btn btn--primary">Filter</button>
          </div>
        </form>

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid grid--cards" aria-busy="true" aria-live="polite">
            {Array.from({length: pageSize}).map((_,i)=> (
              <div key={i} className="card skeleton">
                <div className="skeleton__media" />
                <div className="skeleton__line" />
                <div className="skeleton__line" style={{width:'60%'}} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {current.length === 0 ? (
              <div className="card" style={{marginTop:12}}>
                <div style={{fontWeight:700}}>No adverts found</div>
                <button className="btn btn--light" style={{marginTop:8}} onClick={()=>{ setQ(''); setCategory(''); setStatus(''); setLocation(''); setMinPrice(''); setMaxPrice(''); setBedrooms(''); setSort('newest'); setPage(1); fetchAdverts(); }}>Clear filters</button>
              </div>
            ) : (
              <div className="grid grid--cards">
                {current.map(a => <AdvertCard key={a._id} advert={a} />)}
              </div>
            )}

            {/* Pagination */}
            <div style={{display:'flex', justifyContent:'center', gap:8, marginTop:16}}>
              <button className="btn btn--light" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1, p-1))}>Previous</button>
              <div className="card" style={{padding:'8px 12px'}}>{page} / {totalPages}</div>
              <button className="btn btn--light" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages, p+1))}>Next</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
