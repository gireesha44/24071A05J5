import { Link } from 'react-router-dom';
import { useApp, menuItems } from '../context/AppContext';
import './Home.css';

const categories = [
  { name: 'Pizza', icon: '◻' },
  { name: 'Burgers', icon: '◻' },
  { name: 'Indian', icon: '◻' },
  { name: 'Desserts', icon: '◻' },
  { name: 'Drinks', icon: '◻' },
  { name: 'Salads', icon: '◻' },
];

export default function Home() {
  const { addToCart, user } = useApp();
  const featured = menuItems.slice(0, 6);

  return (
    <div className="home page-wrapper">

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-left">
              <p className="section-label">Food Delivery Platform</p>
              <h1 className="hero-title">Good food,<br />fast delivery.</h1>
              <p className="hero-desc">
                Order from 500+ restaurants. Delivered in under 30 minutes — guaranteed.
              </p>
              <div className="hero-actions">
                <Link to="/menu" className="btn-primary">Browse Menu</Link>
                {!user && <Link to="/signup" className="btn-outline">Create Account</Link>}
              </div>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-num">50k+</span>
                <span className="stat-lbl">Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">500+</span>
                <span className="stat-lbl">Restaurants</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">4.9</span>
                <span className="stat-lbl">Avg Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">&lt;30</span>
                <span className="stat-lbl">Min Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <p className="section-label">Categories</p>
          <div className="cat-strip">
            {categories.map(c => (
              <Link to={`/menu?category=${c.name}`} key={c.name} className="cat-chip">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Featured */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-label">Popular Right Now</p>
              <h2 className="section-title">Featured Dishes</h2>
            </div>
            <Link to="/menu" className="btn-outline" style={{ alignSelf: 'flex-end' }}>View all</Link>
          </div>

          <div className="food-grid">
            {featured.map(item => (
              <div className="food-tile card" key={item.id}>
                <div className="food-tile-top">
                  <div className="food-tile-meta">
                    <span className="food-tile-cat">{item.category}</span>
                    {item.veg && <span className="chip veg">Veg</span>}
                    {item.badge === 'Best Seller' && <span className="chip spicy">Best Seller</span>}
                  </div>
                  <span className="food-tile-rating">★ {item.rating}</span>
                </div>

                {/* Minimal color block instead of image */}
                <div className="food-tile-block" style={{ background: colorFor(item.category) }}>
                  <span className="food-tile-emoji">{emojiFor(item.category)}</span>
                </div>

                <div className="food-tile-body">
                  <h3 className="food-tile-name">{item.name}</h3>
                  <p className="food-tile-time">{item.time}</p>
                  <div className="food-tile-footer">
                    <span className="food-tile-price">₹{item.price}</span>
                    <button className="add-btn" onClick={() => addToCart(item)}>+ Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Why us */}
      <section className="section">
        <div className="container">
          <p className="section-label">Why FoodRush</p>
          <div className="why-grid">
            {[
              { title: 'Fast Delivery', desc: 'Under 30 minutes to your door, every time.' },
              { title: 'Fresh Ingredients', desc: 'Partnered with restaurants that care about quality.' },
              { title: 'Secure Payment', desc: 'Multiple payment methods, fully encrypted.' },
              { title: '24/7 Support', desc: 'Real help whenever you need it.' },
            ].map((w, i) => (
              <div className="why-card card" key={i}>
                <span className="why-num">0{i + 1}</span>
                <h3 className="why-title">{w.title}</h3>
                <p className="why-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <span className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
            FoodRush<span className="logo-dot"></span>
          </span>
          <div className="footer-links">
            <Link to="/menu">Menu</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login">Login</Link>
          </div>
          <p className="footer-copy">© 2025 FoodRush</p>
        </div>
      </footer>
    </div>
  );
}

function colorFor(cat) {
  const map = {
    Pizza: '#fdf4ed', Burgers: '#fdf0ee', Indian: '#fdf8ed',
    Wraps: '#edfdf4', Starters: '#edf3fd', Desserts: '#fdedf8',
    Drinks: '#edfcfd', Salads: '#f0fded', Rice: '#fdf8ed',
  };
  return map[cat] || '#f5f5f3';
}
function emojiFor(cat) {
  const map = {
    Pizza: '🍕', Burgers: '🍔', Indian: '🍛',
    Wraps: '🌯', Starters: '🍗', Desserts: '🍰',
    Drinks: '🥤', Salads: '🥗', Rice: '🍚',
  };
  return map[cat] || '🍽️';
}
