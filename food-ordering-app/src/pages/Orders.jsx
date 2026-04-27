import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Orders.css';

export default function Orders() {
  const { orders } = useApp();

  const statusColor = { Preparing: '#f59e0b', 'Out for Delivery': '#3b82f6', Delivered: '#10b981' };

  if (orders.length === 0) {
    return (
      <div className="orders-page page-wrapper">
        <div className="container orders-empty">
          <div style={{ fontSize: '72px', animation: 'float 3s ease-in-out infinite' }}>📦</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders. Let's get started!</p>
          <Link to="/menu" className="btn-primary" style={{ fontSize: '15px', padding: '14px 32px' }}>
            🍽️ Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page page-wrapper">
      <div className="container">
        <div className="orders-header">
          <span className="tag">📦 My Orders</span>
          <h1 className="section-title" style={{ marginTop: '12px' }}>Order History</h1>
          <p className="section-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        <div className="orders-list">
          {orders.map((order, idx) => {
            const status = idx === 0 ? 'Preparing' : 'Delivered';
            const delivery = order.total >= 500 ? 0 : 49;
            const taxes = Math.round(order.total * 0.05);
            const grand = order.total + delivery + taxes;

            return (
              <div className="order-card glass-card animate-fade-up" key={order.id} style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="order-card-header">
                  <div className="order-id-wrap">
                    <span className="order-id-label">Order ID</span>
                    <span className="order-id">{order.id}</span>
                  </div>
                  <div className="order-header-right">
                    <span className="order-date">
                      {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="order-status-badge" style={{ background: `${statusColor[status]}20`, color: statusColor[status], border: `1px solid ${statusColor[status]}40` }}>
                      {status === 'Preparing' ? '👨‍🍳' : '✅'} {status}
                    </span>
                  </div>
                </div>

                <div className="order-items-list">
                  {order.items.map(item => (
                    <div className="order-item-row" key={item.id}>
                      <img src={item.image} alt={item.name} className="order-item-img" />
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-qty">× {item.qty}</span>
                      <span className="order-item-price">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="order-footer-info">
                    {order.address && (
                      <span className="order-address">
                        📍 {order.address.street}, {order.address.city}
                      </span>
                    )}
                    <span className="order-method">
                      💳 {order.method === 'card' ? 'Card' : order.method === 'upi' ? 'UPI' : order.method === 'cod' ? 'Cash on Delivery' : 'Wallet'}
                    </span>
                  </div>
                  <div className="order-total-wrap">
                    <span className="order-total-label">Total Paid</span>
                    <span className="order-total">₹{grand}</span>
                  </div>
                </div>

                {status === 'Preparing' && (
                  <div className="order-track-bar">
                    {['Confirmed', 'Preparing', 'On the Way', 'Delivered'].map((s, i) => (
                      <div key={s} className={`track-mini-step ${i <= 1 ? 'done' : ''}`}>
                        <div className="track-mini-dot"></div>
                        <span>{s}</span>
                        {i < 3 && <div className="track-mini-line"></div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/menu" className="btn-outline">🍽️ Order Again</Link>
        </div>
      </div>
    </div>
  );
}
