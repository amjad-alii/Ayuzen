import React, { useState, useEffect } from 'react';
import { doctors as mockDoctors } from '../data/doctors'; // Using mock data for now
import DoctorCard from '../components/common/DoctorCard';
import './HomePage.css'; // We can reuse homepage styles

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // In a real app, you would fetch this data from your API
  useEffect(() => {
    setDoctors(mockDoctors);
  }, []);

  // Filter doctors based on the search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="homepage-container">
      <div className="search-hero">
        <h1>Our Trusted Doctors in Lucknow</h1>
        <p>Find the right specialist for your needs.</p>
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or specialty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="doctor-list-container">
        {filteredDoctors.length > 0 ? (
          <div className="doctor-list">
            {filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <p>No doctors found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;