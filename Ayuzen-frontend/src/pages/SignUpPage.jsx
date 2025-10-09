import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUpApi } from '../services/authService';
import Button from '../components/common/Button';
import './SignUpPage.css';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
    age: '',
    role: 'ROLE_PATIENT',
    specialty: '',
    qualification: '',
    experience: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert('Passwords do not match!');
    }
    setIsLoading(true);

    const payload = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      gender: formData.gender,
      age: parseInt(formData.age),
      role: formData.role,
      specialty: formData.specialty,
      qualification: formData.qualification,
      experience: formData.experience ? parseInt(formData.experience) : 0,
    };

    try {
      await signUpApi(payload);
      alert('Sign up successful! Please log in.');
      navigate('/login');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <div className="signup-card">
        <h2 className="title">Create Your Account</h2>
        <form onSubmit={handleSubmit} noValidate>

          <div className="row">
            <div className="floating-label-group">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                required
              />
              <label htmlFor="firstName">First Name</label>
            </div>
            <div className="floating-label-group">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                required
              />
              <label htmlFor="lastName">Last Name</label>
            </div>
          </div>

          <div className="floating-label-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>

          <div className="row">
            <div className="floating-label-group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="floating-label-group">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
          </div>

          <div className="floating-label-group">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              required
            />
            <label htmlFor="phone">Phone Number</label>
          </div>

          <div className="row">
            <div className="floating-label-group">
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value=""></option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <label htmlFor="gender">Gender</label>
            </div>
            <div className="floating-label-group">
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
                max="120"
              />
              <label htmlFor="age">Age</label>
            </div>
          </div>

          <div className="floating-label-group">
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="ROLE_PATIENT">Patient</option>
              <option value="ROLE_DOCTOR">Doctor</option>
              <option value="ROLE_RECEPTIONIST">Receptionist</option>
            </select>
            <label htmlFor="role">I am a</label>
          </div>

          {formData.role === 'ROLE_DOCTOR' && (
            <>
              <div className="floating-label-group">
                <input
                  type="text"
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="specialty">Specialty</label>
              </div>
              <div className="floating-label-group">
                <input
                  type="text"
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="qualification">Qualification</label>
              </div>
              <div className="floating-label-group">
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                />
                <label htmlFor="experience">Years of Experience</label>
              </div>
            </>
          )}

          <Button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <p className="switch-text">
            Already have an account?{' '}
            <Link to="/login">Log In</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default SignUpPage;
