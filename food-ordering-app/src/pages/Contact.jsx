import { useState } from 'react';
import './Contact.css';

const faqs = [
  { q: 'How long does delivery take?', a: 'Most orders are delivered within 25–30 minutes. Actual time depends on your location and restaurant.' },
  { q: 'Can I cancel my order?', a: 'You can cancel within 2 minutes of placing the order. Go to My Orders and click Cancel.' },
  { q: 'What payment methods do you accept?', a: 'We accept Credit/Debit cards, UPI, Cash on Delivery, and all major digital wallets.' },
  { q: 'Is there a minimum order amount?', a: 'There is no minimum order amount. However, delivery fee applies for orders below ₹500.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim() || form.message.length < 10) e.message = 'Please write at least 10 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  return (
    <div className="contact-page page-wrapper">
      {/* Hero */}
      <div className="contact-hero">
        <div className="container">
          <span className="tag">📬 Get In Touch</span>
          <h1 className="section-title" style={{ marginTop: '14px' }}>We'd Love to Hear From You</h1>
          <p className="section-subtitle">Questions, feedback, or just a hello — we're here 24/7</p>
        </div>
      </div>

      <div className="container contact-body">
        {/* Info cards */}
        <div className="contact-info-grid">
          {[
            { icon: '📞', title: 'Call Us', lines: ['+91 98765 43210', 'Mon–Sun, 24/7'] },
            { icon: '📧', title: 'Email Us', lines: ['support@foodrush.com', 'Reply within 2 hours'] },
            { icon: '📍', title: 'Find Us', lines: ['12, Food Street, MG Road', 'Bengaluru, KA – 560001'] },
            { icon: '💬', title: 'Live Chat', lines: ['Chat with us instantly', 'Avg response: 2 min'] },
          ].map((card, i) => (
            <div className="contact-info-card glass-card" key={i}>
              <div className="contact-info-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              {card.lines.map((l, j) => <p key={j}>{l}</p>)}
            </div>
          ))}
        </div>

        <div className="contact-main-grid">
          {/* Form */}
          <div className="contact-form-wrap glass-card animate-fade-up">
            <h2 className="contact-form-title">Send a Message</h2>

            {submitted ? (
              <div className="contact-success animate-fade-in">
                <div className="success-emoji">🎉</div>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out, <strong>{form.name}</strong>! Our team will get back to you within 2 hours.</p>
                <button className="btn-outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input className={`contact-input ${errors.name ? 'err' : ''}`} name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input className={`contact-input ${errors.email ? 'err' : ''}`} name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <select className={`contact-input ${errors.subject ? 'err' : ''}`} name="subject" value={form.subject} onChange={handleChange}>
                    <option value="">Select a topic...</option>
                    <option>Order Issue</option>
                    <option>Delivery Problem</option>
                    <option>Payment Query</option>
                    <option>Feedback</option>
                    <option>Other</option>
                  </select>
                  {errors.subject && <span className="field-error">{errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    className={`contact-input contact-textarea ${errors.message ? 'err' : ''}`}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    rows={5}
                  />
                  <div className="char-count">{form.message.length} / 500</div>
                  {errors.message && <span className="field-error">{errors.message}</span>}
                </div>

                <button type="submit" className="btn-primary contact-submit" disabled={loading}>
                  {loading ? <span className="spinner"></span> : '🚀 Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="faq-wrap">
            <h2 className="contact-form-title">Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className={`faq-item glass-card ${openFaq === i ? 'open' : ''}`}>
                  <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    <span className="faq-chevron">{openFaq === i ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === i && <p className="faq-answer animate-fade-in">{faq.a}</p>}
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="map-card glass-card">
              <div className="map-placeholder">
                <div className="map-pin">📍</div>
                <p>12, Food Street, MG Road</p>
                <p>Bengaluru, Karnataka</p>
                <span className="tag" style={{ marginTop: '8px' }}>Open 24×7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
