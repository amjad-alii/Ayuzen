import React, { useState, useEffect } from 'react';
import { doctors as mockDoctors } from '../data/doctors';
import DoctorCard from '../components/common/DoctorCard';
import './HomePage.css';

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setDoctors(mockDoctors);
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="homepage-container">
      <section className="hero">
        <div className="hero-content">
          <h1>
            <span className="highlight">Book Trusted Doctors</span> in <span className="city">Lucknow</span>
          </h1>
          <p className="subtitle">
            Top specialists. Instant appointments. Your health, our priority.<br />
            <span className="today">{new Date().toLocaleDateString()}</span>
          </p>
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search doctors, specialties, clinics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="hero-actions">
            <button className="cta primary">Book Appointment</button>
            <button className="cta secondary">Become a Listed Doctor</button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Doctor and Patient" />
        </div>
      </section>

      <section className="doctor-list-container">
        <h2 className="list-heading">Meet Our Specialists</h2>
        <p className="list-subtitle">Verified & Highly Rated | Book Instantly</p>
        {filteredDoctors.length > 0 ? (
          <div className="doctor-list">
            {filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <p className="no-results">No doctors found matching your search.</p>
        )}
      </section>

      <section className="why-choose-us">
        <h2>Why Choose Us?</h2>
        <ul className="features">
          <li>✔️ Verified Doctors & Authentic Reviews</li>
          <li>✔️ Hassle-free Booking & Cancellations</li>
          <li>✔️ Data Privacy & Instant Confirmation</li>
          <li>✔️ 24/7 Assistance and Multilanguage Support</li>
        </ul>
      </section>

      <footer className="homepage-footer">
        <div>Need help? <a href="/contact">Contact Support</a></div>
        <div>Doctors: <a href="/doctor-signup">Join the platform</a></div>
        <div>&copy; {new Date().getFullYear()} Ayuzen</div>
      </footer>
    </div>
  );
};

export default HomePage;
