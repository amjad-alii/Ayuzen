import React, { useEffect, useState } from 'react';
import apiClient from '../../services/authService';
import './ClinicAppointmentsPage.css';

const ClinicAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/admin/appointments');
        setAppointments(response.data);
      } catch (err) {
        setError('Failed to fetch appointments. Please ensure the backend is running and you are authorized.');
        console.error("Fetch appointments error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (isLoading) {
    return <div className="loading-message">Loading All Clinic Appointments...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="manage-doctors-page">
      <header className="page-header">
        <h1>All Clinic Appointments</h1>
      </header>

      <div className="table-container">
        <table className="appointments-table" aria-label="Clinic Appointments">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.patientName}</td>
                <td>{appt.doctorName}</td>
                <td>{new Date(appt.appointmentDateTime).toLocaleDateString('en-IN')}</td>
                <td>{new Date(appt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>
                  <span className={`status-pill status-${String(appt.status).toLowerCase()}`}>
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClinicAppointmentsPage;
