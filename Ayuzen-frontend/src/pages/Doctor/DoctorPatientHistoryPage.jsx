import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../services/authService';
import './DoctorPatientHistoryPage.css'; // We'll create this CSS file

const DoctorPatientHistoryPage = () => {
    const { patientId } = useParams(); // Get patient ID from URL
    const [patientName, setPatientName] = useState(''); // Store patient name separately
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch the patient's appointment history with this doctor
                const response = await apiClient.get(`/doctors/patients/${patientId}/history`);
                setAppointments(response.data);
                // Set patient name from the first appointment (assuming it's consistent)
                if (response.data.length > 0) {
                    setPatientName(response.data[0].patientName);
                }
            } catch (err) {
                setError('Failed to fetch patient history.');
                console.error("Fetch patient history error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [patientId]);

    if (isLoading) return <h2>Loading Patient History...</h2>;
    if (error) return <h2 className="error-message">{error}</h2>;

    return (
        <div className="patient-history-page">
            <header className="page-header">
                <h1>Appointment History for {patientName || `Patient ID: ${patientId}`}</h1>
                <Link to="/doctor/dashboard" className="back-button">← Back to Schedule</Link>
            </header>

            <div className="history-list">
                {appointments.length > 0 ? (
                    appointments.map((appt) => (
                        <div key={appt.id} className={`history-card status-${String(appt.status).toLowerCase()}`}>
                            <div className="history-card-header">
                                <span className="history-date">{new Date(appt.appointmentDateTime).toLocaleDateString('en-IN')}</span>
                                <span className={`status-pill status-${String(appt.status).toLowerCase()}`}>{appt.status}</span>
                            </div>
                            <p><strong>Time:</strong> {new Date(appt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p><strong>Notes:</strong> {appt.notes || 'No notes recorded.'}</p>
                            {/* You could add a link/button here to view prescription if available */}
                        </div>
                    ))
                ) : (
                    <p>No appointment history found for this patient with you.</p>
                )}
            </div>
        </div>
    );
};

export default DoctorPatientHistoryPage;