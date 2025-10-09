import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      <h1>About Ayuzen</h1>
      <p className="mission-statement">
        Our mission is to provide seamless and accessible healthcare to the residents of Lucknow. 
        We connect you with trusted medical professionals, ensuring your health is always our top priority.
      </p>
      <div className="about-content">
        <p>
          Founded on October 7, 2025, Ayuzen was created to solve the common challenges patients face: 
          finding the right doctor, booking appointments efficiently, and keeping track of medical records. 
          Our platform is designed with both patients and doctors in mind, aiming to create a healthier community through technology.
        </p>
        <p>
          We are committed to providing a secure, reliable, and user-friendly experience. Thank you for trusting us with your health.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;