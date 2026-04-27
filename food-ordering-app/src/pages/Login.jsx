import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Auth.css';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    login({ name: form.email.split('@')[0], email: form.email });
    navigate('/');
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  return (
    <div className="auth-page">
      <div className="auth-box fade-up">
        <div className="auth-brand">FoodRush<span className="logo-dot"></span></div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label>Email</label>
            <input className={`auth-input ${errors.email ? 'err' : ''}`} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="pass-wrap">
              <input className={`auth-input ${errors.password ? 'err' : ''}`} type={showPass ? 'text' : 'password'} name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
              <button type="button" className="pass-toggle" onClick={() => setShowPass(p => !p)}>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? <span className="spinner-dark"></span> : 'Sign in'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="demo-btn" onClick={() => { login({ name: 'Demo User', email: 'demo@foodrush.com' }); navigate('/'); }}>
          Continue as Demo User
        </button>

        <p className="auth-switch">
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
