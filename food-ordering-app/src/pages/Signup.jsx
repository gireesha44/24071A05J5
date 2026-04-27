import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Auth.css';

export default function Signup() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    login({ name: form.name, email: form.email });
    navigate('/');
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const stColors = ['', '#e8522a', '#f59e0b', '#16a34a'];
  const stLabels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <div className="auth-page">
      <div className="auth-box fade-up">
        <div className="auth-brand">FoodRush<span className="logo-dot"></span></div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join thousands of happy customers</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label>Full Name</label>
            <input className={`auth-input ${errors.name ? 'err' : ''}`} type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input className={`auth-input ${errors.email ? 'err' : ''}`} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="pass-wrap">
              <input className={`auth-input ${errors.password ? 'err' : ''}`} type={showPass ? 'text' : 'password'} name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
              <button type="button" className="pass-toggle" onClick={() => setShowPass(p => !p)}>{showPass ? 'Hide' : 'Show'}</button>
            </div>
            {form.password && (
              <div className="strength-wrap">
                {[1,2,3].map(n => (
                  <div key={n} className="st-seg" style={{ background: n <= strength ? stColors[strength] : undefined }}></div>
                ))}
                <span className="strength-label" style={{ color: stColors[strength] }}>{stLabels[strength]}</span>
              </div>
            )}
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input className={`auth-input ${errors.confirm ? 'err' : ''}`} type="password" name="confirm" placeholder="Repeat password" value={form.confirm} onChange={handleChange} />
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? <span className="spinner-dark"></span> : 'Create account'}
          </button>
        </form>

        <p className="auth-switch" style={{ marginTop: '16px' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
