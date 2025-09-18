import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, clearToken } from '../api/client';

export default function Dashboard() {
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const list = await api.getAdverts({});
      setAdverts(list);
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const markSold = async (id) => {
    try { await api.updateAdvert(id, { status: 'sold' }); await load(); }
    catch (e) { alert(e.message); }
  };
  const undoSold = async (id) => {
    try { await api.updateAdvert(id, { status: 'active' }); await load(); }
    catch (e) { alert(e.message); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this advert?')) return;
    try { await api.deleteAdvert(id); await load(); }
    catch (e) { alert(e.message); }
  };

  const quickPrice = async (id) => {
    const price = window.prompt('New price (leave blank to keep):');
    const sale = window.prompt('Sale price (optional, empty to remove):');
    if (price === null && sale === null) return;
    const payload = {};
    if (price !== null && price !== '') payload.price = Number(price);
    if (sale !== null) payload.salePrice = sale === '' ? null : Number(sale);
    try { await api.updateAdvert(id, payload); await load(); }
    catch (e) { alert(e.message); }
  };
  const toggleHot = async (id, current) => {
    try { await api.updateAdvert(id, { isHot: !current }); await load(); }
    catch (e) { alert(e.message); }
  };

  return (
    <div className="container">
      <div className="topbar">
        <h2 className="topbar__title">PJ Agency Admin</h2>
        <button className="btn btn--light" onClick={() => { clearToken(); window.location.href = '/login'; }}>Sign out</button>
      </div>

      <div className="grid" style={{gap:12, marginBottom:16}}>
        <Link to="/admin/new" className="card link-card">Create New Advert</Link>
        <a className="card link-card" href="/adverts" target="_blank" rel="noreferrer">View Public Listing</a>
      </div>

      <div className="card">
        <div className="toolbar">
          <h3 style={{margin:0}}>Uploaded Adverts</h3>
          <button onClick={load} className="btn btn--light">Refresh</button>
        </div>
        {err && <div className="error" style={{marginTop:8}}>{err}</div>}
        {loading ? (
          <div style={{padding:12}}>Loading…</div>
        ) : (
          <div className="admin-table" style={{overflowX:'auto'}}>
            <table className="admin-table__table">
              <thead>
                <tr>
                  <th style={{textAlign:'left'}}>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Sale</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Hot</th>
                  <th>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adverts.map(a => {
                  const hasDeleteAt = !!a.deleteAt;
                  const remainingMs = hasDeleteAt ? (new Date(a.deleteAt).getTime() - Date.now()) : null;
                  const remainingH = remainingMs != null ? Math.max(0, Math.floor(remainingMs / (1000*60*60))) : null;
                  const remainingM = remainingMs != null ? Math.max(0, Math.floor((remainingMs % (1000*60*60)) / (1000*60))) : null;
                  const discount = a.salePrice != null && a.salePrice < a.price ? Math.round(100 - (a.salePrice / a.price) * 100) : null;
                  return (
                    <tr key={a._id}>
                      <td style={{textAlign:'left'}}>{a.title}</td>
                      <td>{a.category?.name || '-'}</td>
                      <td>{a.currency} {Number(a.price).toLocaleString()}</td>
                      <td>{a.salePrice != null ? `${a.currency} ${Number(a.salePrice).toLocaleString()}${discount?` (-${discount}%)`:''}` : '-'}</td>
                      <td>{a.location}</td>
                      <td>
                        <span className={`status status--${a.status}`}>{a.status}</span>
                        {hasDeleteAt && (
                          <div className="muted">Auto-delete in {remainingH}h {remainingM}m</div>
                        )}
                      </td>
                      <td>{a.isHot ? 'Yes' : 'No'}</td>
                      <td>{a.images?.length || 0}</td>
                      <td className="actions">
                        <button className="btn" onClick={() => quickPrice(a._id)}>Edit price</button>
                        <button className="btn" onClick={() => toggleHot(a._id, a.isHot)}>{a.isHot?'Unmark hot':'Mark hot'}</button>
                        {a.status !== 'sold' ? (
                          <button className="btn btn--primary" onClick={() => markSold(a._id)}>Mark sold</button>
                        ) : (
                          <button className="btn btn--light" onClick={() => undoSold(a._id)}>Undo sold</button>
                        )}
                        <button className="btn btn--danger" onClick={() => remove(a._id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
