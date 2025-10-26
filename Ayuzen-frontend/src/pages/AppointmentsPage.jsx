import React from 'react';
import { useAppointments } from '../context/AppointmentContext';
import './AppointmentsPage.css';

const AppointmentsPage = () => {
  const { appointments, isLoading, error, cancelAppointment } = useAppointments(); // Assume context provides these

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      alert("Appointment successfully cancelled.");
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading && appointments.length === 0) {
    return <div className="appointments-container"><h1>Loading your appointments...</h1></div>;
  }

  if (error) {
    return <div className="appointments-container"><h1>Error: {error}</h1></div>;
  }

  return (
    <div className="appointments-container">
      <h1>My Appointments</h1>

      {appointments.length === 0 ? (
        <div className="no-appointments">
          {/* ... empty state content ... */}
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appt) => (
            <div key={appt.id} className={`appointment-card ${appt.status === 'CANCELLED' ? 'cancelled' : ''}`}>
              <div className="appoint-card-header">
                {/* ... doctor info ... */}
                <img
                  src={appt.doctorImage || "https://cdn.jsdelivr.net/gh/AmjadAli9/assets/doctor-avatar.svg"}
                  alt={`Dr. ${appt.doctorName}`}
                  className="doctor-avatar"
                />
                <div>
                  <h3>Dr. {appt.doctorName}</h3>
                  <span className="specialty-pill">{appt.doctorSpecialty}</span>
                </div>
              </div>
              <div className="appoint-details">
                <div className="datetime-group">
                  <span className="datetime-pill">{new Date(appt.appointmentDateTime).toLocaleDateString('en-IN')}</span>
                  <span className="datetime-pill">{new Date(appt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className={`status-label status-${String(appt.status).toLowerCase()}`}>
                  {appt.status}
                </p>
              </div>

              {/* --- NEW PRESCRIPTION SECTION --- */}
              {appt.prescription && ( // Only render if prescription data exists
                <div className="prescription-details-patient">
                  <h4>Prescription Details</h4>
                  <p><strong>Diagnosis:</strong> {appt.prescription.diagnosis || 'N/A'}</p>
                  <pre><strong>Medicines:</strong> {appt.prescription.medicines || 'N/A'}</pre>
                  <p><strong>Advice:</strong> {appt.prescription.advice || 'N/A'}</p>
                </div>
              )}
              {/* --- END OF PRESCRIPTION SECTION --- */}

              {/* Cancel Button */}
              {appt.status === 'CONFIRMED' && (
                 <div className="card-actions">
                    <button
                        className="cancel-btn"
                        onClick={() => handleCancel(appt.id)}
                    >
                        Cancel Appointment
                    </button>
                 </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;