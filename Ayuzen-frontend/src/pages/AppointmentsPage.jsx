import React from 'react';
import { useAppointments } from '../context/AppointmentContext';
import './AppointmentsPage.css';

// Example cancel API (adjust with your real call)
const cancelAppointmentApi = async (appointmentId) => {
  // Replace with actual API call:
  // await axios.patch(`/api/appointments/${appointmentId}/cancel`);
  return Promise.resolve();
};

const AppointmentsPage = () => {
  const { appointments, setAppointments } = useAppointments();
  console.log(appointments); // Check data structure

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await cancelAppointmentApi(id);
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: 'CANCELLED' } : apt
        )
      );
      alert("Appointment cancelled.");
    } catch (err) {
      alert("Failed to cancel the appointment. Please try again.");
    }
  };

  return (
    <div className="appointments-container">
      <h1>My Appointments</h1>
      {appointments.length === 0 ? (
        <div className="no-appointments">
          <img src="https://cdn.jsdelivr.net/gh/AmjadAli9/assets/health-empty-state.svg" alt="" className="empty-illustration" />
          <h2>No upcoming appointments</h2>
          <p>It’s a great time to find the right doctor in Lucknow and take charge of your health.</p>
          <a href="/doctors" className="find-doctor-btn">Find a Doctor</a>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appt) => {
            // Use appointmentDateTime (not appointment_date_time)
            let formattedDate = '';
            let formattedTime = '';
            if (appt.appointmentDateTime) {
              const dt = new Date(appt.appointmentDateTime);
              formattedDate = dt.toLocaleDateString();
              formattedTime = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            return (
              <div key={appt.id} className="appointment-card">
                <div className="appoint-card-header">
                  <img
                    src={appt.doctorImage || "https://sp.yimg.com/ib/th/id/OIP.8qshSGZlLp0QVsFb0c3PZgHaGe?pid=Api&w=148&h=148&c=7&dpr=2&rs=1"}
                    alt={appt.doctorName}
                    className="doctor-avatar"
                  />
                  <div>
                    <h3>{appt.doctorName}</h3>
                    <span className="specialty-pill">{appt.doctorSpecialty}</span>
                  </div>
                </div>
                <div className="appoint-details">
                  <div className="datetime-group">
                    <span className="datetime-pill">{formattedDate}</span>
                    <span className="datetime-pill">{formattedTime}</span>
                  </div>
                  <p className={`status-label ${appt.status?.toLowerCase()}`}>{appt.status || "Scheduled"}</p>
                </div>
                {appt.status !== "CANCELLED" && appt.status !== "COMPLETED" && (
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancel(appt.id)}
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
