import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Payment.css';

const METHODS = [
  { id: 'card', label: 'Credit / Debit Card' },
  { id: 'upi',  label: 'UPI' },
  { id: 'cod',  label: 'Cash on Delivery' },
  { id: 'wallet', label: 'Digital Wallet' },
];

function emojiFor(cat) {
  const m={Pizza:'🍕',Burgers:'🍔',Indian:'🍛',Wraps:'🌯',Starters:'🍗',Desserts:'🍰',Drinks:'🥤',Salads:'🥗',Rice:'🍚'};
  return m[cat]||'🍽️';
}

export default function Payment() {
  const { cart, cartTotal, placeOrder, user } = useApp();
  const navigate = useNavigate();

  const delivery = cartTotal >= 500 ? 0 : 49;
  const taxes = Math.round(cartTotal * 0.05);
  const grand = cartTotal + delivery + taxes;

  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const [addr, setAddr] = useState({ name: user?.name || '', phone: '', street: '', city: '', pin: '' });
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', holder: '' });
  const [upi, setUpi] = useState('');
  const [errors, setErrors] = useState({});

  const fmtCard = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const fmtExp  = v => { const d=v.replace(/\D/g,'').slice(0,4); return d.length>=3?`${d.slice(0,2)}/${d.slice(2)}`:d; };

  const v1 = () => {
    const e={};
    if(!addr.name) e.name='Required';
    if(!addr.phone||addr.phone.length<10) e.phone='10-digit number';
    if(!addr.street) e.street='Required';
    if(!addr.city) e.city='Required';
    if(!addr.pin||addr.pin.length<6) e.pin='6-digit PIN';
    setErrors(e); return !Object.keys(e).length;
  };
  const v2 = () => {
    const e={};
    if(method==='card'){
      if(card.number.replace(/\s/g,'').length<16) e.cardNum='Invalid';
      if(!card.expiry||card.expiry.length<5) e.expiry='Invalid';
      if(!card.cvv||card.cvv.length<3) e.cvv='Invalid';
      if(!card.holder) e.holder='Required';
    } else if(method==='upi'){
      if(!upi.includes('@')) e.upi='Invalid UPI ID';
    }
    setErrors(e); return !Object.keys(e).length;
  };

  const handleOrder = async () => {
    setLoading(true);
    await new Promise(r=>setTimeout(r,1500));
    const o = placeOrder({ address: addr, method });
    setOrder(o);
    setStep(4);
    setLoading(false);
  };

  if (!cart.length && !order) {
    return (
      <div className="payment-page page-wrapper">
        <div className="container" style={{textAlign:'center',paddingTop:'80px'}}>
          <p style={{fontSize:'36px',marginBottom:'12px'}}>🛒</p>
          <h2 style={{fontWeight:800,marginBottom:'8px'}}>Cart is empty</h2>
          <p style={{color:'var(--text-muted)',marginBottom:'20px',fontSize:'14px'}}>Add items first</p>
          <button className="btn-primary" onClick={()=>navigate('/menu')}>Browse Menu</button>
        </div>
      </div>
    );
  }

  /* ── Success ── */
  if (step === 4 && order) {
    return (
      <div className="payment-page page-wrapper">
        <div className="container">
          <div className="success-wrap card fade-up">
            <div className="success-icon">✓</div>
            <h1 className="success-title">Order Placed!</h1>
            <p className="success-sub">Your food is being prepared and will arrive soon.</p>
            <div className="success-id">{order.id}</div>

            <div className="success-details">
              <div className="success-row"><span>Amount Paid</span><span>₹{grand}</span></div>
              <div className="success-row"><span>Payment</span><span>{METHODS.find(m=>m.id===order.method)?.label}</span></div>
              <div className="success-row"><span>Estimated Time</span><span>25–30 min</span></div>
            </div>

            <div className="success-track">
              {['Confirmed','Preparing','On the Way','Delivered'].map((s,i)=>(
                <div key={s} className={`track-step ${i<2?'done':''} ${i===1?'active':''}`}>
                  <span className="track-icon">{['✓','👨‍🍳','🛵','✓'][i]}</span>
                  {s}
                </div>
              ))}
            </div>

            <div className="success-btns">
              <button className="btn-primary" onClick={()=>navigate('/orders')}>View Orders</button>
              <button className="btn-outline" onClick={()=>navigate('/menu')}>Order Again</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page page-wrapper">
      <div className="container">
        <div className="payment-header">
          <p className="section-label">Checkout</p>
          <h1 className="section-title" style={{fontSize:'1.6rem'}}>Complete your order</h1>
        </div>

        {/* Steps */}
        <div className="steps-bar">
          {['Address','Payment','Review'].map((s,i)=>(
            <div key={s} className={`step-item ${step>i+1?'done':''} ${step===i+1?'active':''}`}>
              <div className="step-circle">{step>i+1?'✓':i+1}</div>
              <span>{s}</span>
              {i<2&&<div className="step-line"></div>}
            </div>
          ))}
        </div>

        <div className="payment-layout">
          {/* LEFT PANEL */}
          <div>
            {/* Step 1: Address */}
            {step===1&&(
              <div className="payment-panel card fade-up">
                <h2 className="panel-heading">Delivery Address</h2>
                <div className="addr-grid">
                  <div className="fg"><label>Full Name</label><input className={`p-input ${errors.name?'err':''}`} value={addr.name} onChange={e=>setAddr(p=>({...p,name:e.target.value}))} placeholder="John Doe"/>{errors.name&&<span className="field-error">{errors.name}</span>}</div>
                  <div className="fg"><label>Phone</label><input className={`p-input ${errors.phone?'err':''}`} value={addr.phone} onChange={e=>setAddr(p=>({...p,phone:e.target.value.replace(/\D/,'').slice(0,10)}))} placeholder="10-digit number"/>{errors.phone&&<span className="field-error">{errors.phone}</span>}</div>
                  <div className="fg full"><label>Street Address</label><input className={`p-input ${errors.street?'err':''}`} value={addr.street} onChange={e=>setAddr(p=>({...p,street:e.target.value}))} placeholder="Flat / Building / Street"/>{errors.street&&<span className="field-error">{errors.street}</span>}</div>
                  <div className="fg"><label>City</label><input className={`p-input ${errors.city?'err':''}`} value={addr.city} onChange={e=>setAddr(p=>({...p,city:e.target.value}))} placeholder="City"/>{errors.city&&<span className="field-error">{errors.city}</span>}</div>
                  <div className="fg"><label>PIN Code</label><input className={`p-input ${errors.pin?'err':''}`} value={addr.pin} onChange={e=>setAddr(p=>({...p,pin:e.target.value.replace(/\D/,'').slice(0,6)}))} placeholder="6-digit PIN"/>{errors.pin&&<span className="field-error">{errors.pin}</span>}</div>
                </div>
                <div className="step-actions">
                  <button className="btn-primary next-btn" onClick={()=>{if(v1())setStep(2);}}>Continue</button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step===2&&(
              <div className="payment-panel card fade-up">
                <h2 className="panel-heading">Payment Method</h2>
                <div className="method-list">
                  {METHODS.map(m=>(
                    <button key={m.id} className={`method-item ${method===m.id?'sel':''}`} onClick={()=>setMethod(m.id)}>
                      <div className="method-radio">{method===m.id&&<div className="method-radio-dot"></div>}</div>
                      {m.label}
                    </button>
                  ))}
                </div>

                {method==='card'&&(
                  <div className="card-form fade-in">
                    <div className="card-visual">
                      <div style={{fontSize:'11px',opacity:0.6,marginBottom:'8px'}}>CARD NUMBER</div>
                      <div className="card-num-display">{card.number||'•••• •••• •••• ••••'}</div>
                      <div className="card-row-b"><span>{card.holder||'CARDHOLDER NAME'}</span><span>{card.expiry||'MM/YY'}</span></div>
                    </div>
                    <div className="addr-grid">
                      <div className="fg full"><label>Card Number</label><input className={`p-input ${errors.cardNum?'err':''}`} value={card.number} onChange={e=>setCard(p=>({...p,number:fmtCard(e.target.value)}))} placeholder="1234 5678 9012 3456"/>{errors.cardNum&&<span className="field-error">{errors.cardNum}</span>}</div>
                      <div className="fg full"><label>Cardholder Name</label><input className={`p-input ${errors.holder?'err':''}`} value={card.holder} onChange={e=>setCard(p=>({...p,holder:e.target.value.toUpperCase()}))} placeholder="Name on card"/>{errors.holder&&<span className="field-error">{errors.holder}</span>}</div>
                      <div className="fg"><label>Expiry</label><input className={`p-input ${errors.expiry?'err':''}`} value={card.expiry} onChange={e=>setCard(p=>({...p,expiry:fmtExp(e.target.value)}))} placeholder="MM/YY"/>{errors.expiry&&<span className="field-error">{errors.expiry}</span>}</div>
                      <div className="fg"><label>CVV</label><input className={`p-input ${errors.cvv?'err':''}`} value={card.cvv} onChange={e=>setCard(p=>({...p,cvv:e.target.value.replace(/\D/,'').slice(0,3)}))} placeholder="•••" type="password"/>{errors.cvv&&<span className="field-error">{errors.cvv}</span>}</div>
                    </div>
                  </div>
                )}
                {method==='upi'&&(
                  <div className="upi-form fade-in">
                    <div className="fg"><label>UPI ID</label><input className={`p-input ${errors.upi?'err':''}`} value={upi} onChange={e=>setUpi(e.target.value)} placeholder="yourname@upi"/>{errors.upi&&<span className="field-error">{errors.upi}</span>}</div>
                  </div>
                )}
                {method==='cod'&&(
                  <div className="cod-info fade-in">
                    <p className="cod-box">Pay <strong>₹{grand}</strong> in cash when your order arrives. Please keep exact change ready.</p>
                  </div>
                )}
                {method==='wallet'&&(
                  <div className="wallet-grid fade-in">
                    {['Paytm','PhonePe','Amazon Pay','Google Pay'].map(w=>(
                      <button key={w} className="wallet-item">{w}</button>
                    ))}
                  </div>
                )}

                <div className="step-actions">
                  <button className="btn-outline" onClick={()=>setStep(1)}>Back</button>
                  <button className="btn-primary next-btn" onClick={()=>{if(v2())setStep(3);}}>Continue</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step===3&&(
              <div className="payment-panel card fade-up">
                <h2 className="panel-heading">Review & Place Order</h2>

                <div className="review-block">
                  <p className="review-label">Delivery to</p>
                  <p className="review-val">{addr.name} · {addr.phone}</p>
                  <p className="review-sub">{addr.street}, {addr.city} – {addr.pin}</p>
                </div>

                <div className="review-block">
                  <p className="review-label">Payment</p>
                  <p className="review-val">{METHODS.find(m=>m.id===method)?.label}</p>
                </div>

                <div className="review-items-list">
                  {cart.map(item=>(
                    <div key={item.id} className="review-item">
                      <div className="review-item-emoji">{emojiFor(item.category)}</div>
                      <span style={{flex:1}}>{item.name} × {item.qty}</span>
                      <span className="review-item-price">₹{item.price*item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="divider" style={{margin:'12px 0'}}></div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'15px',fontWeight:800,marginBottom:'20px'}}>
                  <span>Total</span><span>₹{grand}</span>
                </div>

                <div className="step-actions">
                  <button className="btn-outline" onClick={()=>setStep(2)}>Back</button>
                  <button className="btn-primary next-btn" onClick={handleOrder} disabled={loading}>
                    {loading?<span className="spinner-dark"></span>:'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Mini summary */}
          <div className="pay-summary card">
            <h3 className="pay-sum-title">Order Summary</h3>
            <div className="divider" style={{marginBottom:'14px'}}></div>
            <div className="pay-items">
              {cart.map(item=>(
                <div key={item.id} className="pay-item">
                  <div className="pay-item-icon">{emojiFor(item.category)}</div>
                  <div style={{flex:1}}>
                    <div className="pay-item-name">{item.name}</div>
                    <div className="pay-item-qty">× {item.qty}</div>
                  </div>
                  <div className="pay-item-price">₹{item.price*item.qty}</div>
                </div>
              ))}
            </div>
            <div className="divider" style={{margin:'12px 0'}}></div>
            <div className="pay-total-lines">
              <div className="pay-line"><span>Subtotal</span><span>₹{cartTotal}</span></div>
              <div className="pay-line"><span>Delivery</span><span>{delivery===0?'Free':`₹${delivery}`}</span></div>
              <div className="pay-line"><span>Tax</span><span>₹{taxes}</span></div>
              <div className="divider" style={{margin:'6px 0'}}></div>
              <div className="pay-line pay-grand"><span>Total</span><span>₹{grand}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
