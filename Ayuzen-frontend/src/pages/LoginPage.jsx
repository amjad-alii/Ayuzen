import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../services/authService';
import Button from '../components/common/Button';
import './LoginPage.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = await loginApi(credentials);
      if (token) {
        login({ token });
        navigate('/');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login to MediFlow</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder=" " 
              value={credentials.email} 
              onChange={handleChange} 
              required 
              autoComplete="email" 
            />
            <label htmlFor="email">Email Address</label>
          </div>
          <div className="input-group">
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder=" " 
              value={credentials.password} 
              onChange={handleChange} 
              required 
              autoComplete="current-password" 
            />
            <label htmlFor="password">Password</label>
          </div>
          <Button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Logging In...' : 'Log In'}
          </Button>
        </form>
        <p className="signup-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
