import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Cart.css';

function emojiFor(cat) {
  const m = { Pizza:'🍕',Burgers:'🍔',Indian:'🍛',Wraps:'🌯',Starters:'🍗',Desserts:'🍰',Drinks:'🥤',Salads:'🥗',Rice:'🍚' };
  return m[cat] || '🍽️';
}

export default function Cart() {
  const { cart, cartTotal, cartCount, updateQty, removeFromCart, user } = useApp();
  const navigate = useNavigate();

  const delivery = cartTotal > 0 ? (cartTotal >= 500 ? 0 : 49) : 0;
  const taxes = Math.round(cartTotal * 0.05);
  const grand = cartTotal + delivery + taxes;

  if (cart.length === 0) {
    return (
      <div className="cart-page page-wrapper">
        <div className="container cart-empty-state">
          <p style={{ fontSize: '40px' }}>🛒</p>
          <h2>Your cart is empty</h2>
          <p>Add items from the menu to get started.</p>
          <Link to="/menu" className="btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-wrapper">
      <div className="container">
        <div className="cart-header">
          <div>
            <p className="section-label">Your Cart</p>
            <h1 className="section-title">{cartCount} item{cartCount !== 1 ? 's' : ''}</h1>
          </div>
          <Link to="/menu" className="btn-outline">+ Add more</Link>
        </div>

        <div className="cart-layout">
          {/* Items list */}
          <div className="cart-items">
            {cart.map(item => (
              <div className="cart-row card" key={item.id}>
                {/* Emoji block replaces image */}
                <div className="cart-emoji-block">
                  <span>{emojiFor(item.category)}</span>
                </div>

                <div className="cart-row-info">
                  <div className="cart-row-top">
                    <div>
                      <p className="cart-row-cat">{item.category}</p>
                      <h3 className="cart-row-name">{item.name}</h3>
                    </div>
                    <button className="cart-remove" onClick={() => removeFromCart(item.id)} title="Remove">Remove</button>
                  </div>

                  <div className="cart-row-bottom">
                    <span className="cart-row-price">₹{item.price * item.qty}</span>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <h2 className="summary-heading">Order Summary</h2>
            <div className="divider" style={{ margin: '16px 0' }}></div>

            <div className="summary-lines">
              <div className="summary-line"><span>Subtotal</span><span>₹{cartTotal}</span></div>
              <div className="summary-line">
                <span>Delivery</span>
                {delivery === 0 ? <span style={{ color: '#16a34a', fontWeight: 700 }}>Free</span> : <span>₹{delivery}</span>}
              </div>
              <div className="summary-line"><span>Tax (5%)</span><span>₹{taxes}</span></div>
              {delivery > 0 && (
                <p className="free-hint">Add ₹{500 - cartTotal} more for free delivery</p>
              )}
            </div>

            <div className="divider" style={{ margin: '16px 0' }}></div>

            <div className="summary-line total-line">
              <span>Total</span>
              <span>₹{grand}</span>
            </div>

            <div className="promo-row">
              <input type="text" placeholder="Promo code" className="promo-input" />
              <button className="promo-btn">Apply</button>
            </div>

            <button
              className="btn-primary checkout-btn"
              onClick={() => { if (!user) navigate('/login'); else navigate('/payment'); }}
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>

            <p className="secure-note">🔒 Payments are 100% secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
