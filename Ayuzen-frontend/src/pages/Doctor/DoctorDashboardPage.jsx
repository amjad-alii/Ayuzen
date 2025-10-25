import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import apiClient from '../../services/authService';
import './DoctorDashboardPage.css';

const DoctorDashboardPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiClient.get('/doctors/my-appointments');
                setAppointments(response.data);
            } catch (err) {
                setError('Failed to fetch your schedule.');
                console.error("Fetch schedule error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    if (isLoading) return <h2>Loading Your Schedule...</h2>;
    if (error) return <h2 className="error-message">{error}</h2>;

    return (
        <div className="doctor-dashboard">
            {/* --- ADDED HEADER WITH LINK --- */}
            <header className="doctor-dashboard-header">
                <h1>My Appointments for Today</h1>
                <Link to="/doctor/schedule" className="manage-schedule-link">
                    Manage My Schedule
                </Link>
            </header>
            {/* --- END OF ADDED HEADER --- */}

            <div className="appointments-list">
                {appointments.length > 0 ? appointments.map(appt => (
                    <div key={appt.id} className="appointment-card-doctor">
                        <div className="time">{new Date(appt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="patient-details">
                            <h4>{appt.patientName}</h4>
                            <p>Status: <span className={`status-pill status-${String(appt.status).toLowerCase()}`}>{appt.status}</span></p>
                        </div>
                        <Link to={`/doctor/patients/${appt.userId}/history`} className="view-details-btn">
                            View History
                        </Link>
                    </div>
                )) : (
                    <p>You have no appointments scheduled.</p>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboardPage;