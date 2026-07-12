import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert('Login failed. Check your credentials.');
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card glass-panel">
        <h2>Welcome Back</h2>
        <p>Login to view your price alerts</p>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="primary-btn">Sign In</button>
        </form>
        <p className="auth-link">Don't have an account? <span onClick={() => navigate('/signup')}>Sign up</span></p>
      </div>
    </div>
  );
};

export default Login;
