import React from 'react';
import { Link } from 'react-router-dom';
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  const { id, name, specialty, image, rating = 4.8, experience = 7, clinic = 'City Clinic, Lucknow' } = doctor || {};

  return (
    <article className="doctor-card">
      <div className="doc-media">
        <img src={image} alt={`Dr. ${name}`} className="doc-avatar" />
        <span className="doc-badge">Top Rated</span>
      </div>

      <div className="doc-content">
        <h3 className="doc-name">{name}</h3>
        <p className="doc-specialty">{specialty}</p>

        <div className="doc-metrics">
          <span className="metric">
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            {rating} • 500+ reviews
          </span>
          <span className="dot">•</span>
          <span className="metric">
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
            </svg>
            {experience}+ yrs
          </span>
        </div>

        <p className="doc-clinic">{clinic}</p>
      </div>

      <div className="doc-actions">
        <Link to={`/doctor/${id}`} className="btn primary">Book Appointment</Link>
        <Link to={`/doctor/${id}`} className="btn ghost">View Profile</Link>
      </div>
    </article>
  );
};

export default DoctorCard;
