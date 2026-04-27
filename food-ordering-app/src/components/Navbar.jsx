import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, cartCount } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); setMenuOpen(false); };

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/menu', label: 'Menu' },
    { to: '/contact', label: 'Contact' },
    ...(user ? [{ to: '/orders', label: 'Orders' }] : []),
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          FoodRush<span className="logo-dot"></span>
        </Link>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to} end={l.end}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-btn" onClick={() => setMenuOpen(false)}>
                Cart
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
              <div className="user-pill">
                <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
                {user.name?.split(' ')[0]}
                <button className="logout-btn" onClick={handleLogout}>✕</button>
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-outline" style={{ padding: '7px 16px', fontSize: '13px' }}>Log in</Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '7px 16px', fontSize: '13px' }}>Sign up</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
