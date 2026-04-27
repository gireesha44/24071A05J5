import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp, menuItems } from '../context/AppContext';
import './Menu.css';

const ALL_CATS = ['All', 'Pizza', 'Burgers', 'Indian', 'Wraps', 'Starters', 'Desserts', 'Drinks', 'Salads', 'Rice'];

function colorFor(cat) {
  const m = { Pizza:'#fdf4ed',Burgers:'#fdf0ee',Indian:'#fdf8ed',Wraps:'#edfdf4',Starters:'#edf3fd',Desserts:'#fdedf8',Drinks:'#edfcfd',Salads:'#f0fded',Rice:'#fdf8ed' };
  return m[cat] || '#f5f5f3';
}
function emojiFor(cat) {
  const m = { Pizza:'🍕',Burgers:'🍔',Indian:'🍛',Wraps:'🌯',Starters:'🍗',Desserts:'🍰',Drinks:'🥤',Salads:'🥗',Rice:'🍚' };
  return m[cat] || '🍽️';
}

export default function Menu() {
  const { addToCart, cart } = useApp();
  const [searchParams] = useSearchParams();
  const [activeCat, setActiveCat] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [vegOnly, setVegOnly] = useState(false);
  const [addedId, setAddedId] = useState(null);

  const filtered = useMemo(() => {
    let items = menuItems;
    if (activeCat !== 'All') items = items.filter(i => i.category === activeCat);
    if (search) items = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    if (vegOnly) items = items.filter(i => i.veg);
    if (sortBy === 'price-asc') items = [...items].sort((a,b) => a.price - b.price);
    else if (sortBy === 'price-desc') items = [...items].sort((a,b) => b.price - a.price);
    else if (sortBy === 'rating') items = [...items].sort((a,b) => b.rating - a.rating);
    return items;
  }, [activeCat, search, sortBy, vegOnly]);

  const handleAdd = (item) => {
    addToCart(item);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1000);
  };

  const cartQty = (id) => cart.find(i => i.id === id)?.qty || 0;

  return (
    <div className="menu-page page-wrapper">
      <div className="menu-top-bar">
        <div className="container">
          <div className="menu-top-inner">
            <div>
              <p className="section-label">Our Menu</p>
              <h1 className="menu-title">What would you like?</h1>
            </div>

            <div className="menu-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="search-input"
                />
                {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
              </div>

              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-sel">
                <option value="default">Sort: Default</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
              </select>

              <label className="veg-toggle">
                <input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} />
                <span className="veg-track"></span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Veg only</span>
              </label>
            </div>
          </div>

          {/* Category tabs */}
          <div className="cat-tabs">
            {ALL_CATS.map(c => (
              <button key={c} className={`cat-tab ${activeCat === c ? 'active' : ''}`} onClick={() => setActiveCat(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container menu-body">
        {filtered.length === 0 ? (
          <div className="menu-empty">
            <p style={{ fontSize: '32px' }}>🍽️</p>
            <h3>No dishes found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Try adjusting your filters</p>
            <button className="btn-outline" style={{ marginTop: '12px' }} onClick={() => { setSearch(''); setActiveCat('All'); setVegOnly(false); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="results-cnt">{filtered.length} dish{filtered.length !== 1 ? 'es' : ''}</p>
            <div className="menu-grid">
              {filtered.map(item => (
                <div className="m-card card" key={item.id}>
                  {/* Color block */}
                  <div className="m-card-block" style={{ background: colorFor(item.category) }}>
                    <span className="m-card-emoji">{emojiFor(item.category)}</span>
                    {item.veg && <span className="m-veg-dot" title="Veg">●</span>}
                  </div>

                  <div className="m-card-body">
                    <div className="m-card-top">
                      <span className="m-cat">{item.category}</span>
                      <span className="m-rating">★ {item.rating}</span>
                    </div>
                    <h3 className="m-name">{item.name}</h3>
                    <p className="m-time">{item.time}</p>
                    {item.badge && <span className="chip" style={{ marginBottom: '10px', display: 'inline-flex' }}>{item.badge}</span>}
                    <div className="m-footer">
                      <span className="m-price">₹{item.price}</span>
                      <button
                        className={`m-add-btn ${addedId === item.id ? 'added' : ''}`}
                        onClick={() => handleAdd(item)}
                      >
                        {addedId === item.id ? '✓ Added' : cartQty(item.id) > 0 ? `Add (${cartQty(item.id)})` : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
