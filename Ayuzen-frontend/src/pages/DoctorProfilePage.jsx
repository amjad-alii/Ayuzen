import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctors } from '../data/doctors';
import { useAppointments } from '../context/AppointmentContext';
import Button from '../components/common/Button';
import TimeSlotSelector from '../components/booking/TimeSlotSelector';
import './DoctorProfilePage.css';

const DoctorProfilePage = () => {
  const { doctorId } = useParams();
  const { bookAppointment } = useAppointments();
  const navigate = useNavigate();
  const doctor = doctors.find(d => d.id === parseInt(doctorId));
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleBooking = () => {
    if (!selectedSlot) {
      alert("Please select a time slot first.");
      return;
    }

    const appointmentDetails = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      date: selectedSlot.date.toLocaleDateString(),
      time: selectedSlot.time,
    };
    
    bookAppointment(appointmentDetails);
    alert(`Booking confirmed!`);
    
    // THE FIX IS ON THIS LINE
    navigate('/my-appointments'); // Redirect to the correct appointments page
  };

  if (!doctor) {
    return <h2>Doctor not found.</h2>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={doctor.image} alt={`Dr. ${doctor.name}`} className="profile-image" />
        <div className="profile-header-info">
          <h1> {doctor.name}</h1>
          <p className="specialty">{doctor.specialty}</p>
          <p className="location">{doctor.location}</p>
        </div>
      </div>

      <div className="profile-body">
        <div className="info-box">
          <h3>About</h3>
          <p>Dr. {doctor.name} is a highly respected {doctor.specialty} based in {doctor.location}. With over 15 years of experience, they are dedicated to providing the best patient care here in Lucknow.</p>
        </div>

        <div className="info-box booking-box">
          <h3>Book a Consultation</h3>
          <p className="fee">Fee: ₹{doctor.fee}</p>
          <TimeSlotSelector onSlotSelect={setSelectedSlot} />
          <div className="confirm-button-container">
            <Button onClick={handleBooking} disabled={!selectedSlot}>
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;