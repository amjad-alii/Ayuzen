import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../services/authService';
import './ManagePatientsPage.css'; // Reuse table styles

const PatientHistoryPage = () => {
    const { patientId } = useParams(); // Get patient ID from URL
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch both patient details and their appointments
                const patientRes = await apiClient.get(`/admin/patients/${patientId}`);
                const appointmentsRes = await apiClient.get(`/admin/patients/${patientId}/appointments`);
                setPatient(patientRes.data);
                setAppointments(appointmentsRes.data);
            } catch (err) {
                setError('Failed to fetch patient history.');
                console.error("Fetch patient history error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [patientId]);

    if (isLoading) return <h2>Loading Patient History...</h2>;
    if (error) return <h2 className="error-message">{error}</h2>;

    return (
        <div className="manage-patients-page">
            <header className="page-header">
                <div>
                    <h1>Appointment History for {patient?.fullName}</h1>
                    <p className="patient-contact">{patient?.email} | {patient?.phone}</p>
                </div>
                <Link to="/admin/patients" className="back-button">← Back to All Patients</Link>
            </header>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Doctor Name</th>
                            <th>Specialty</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appt) => (
                            <tr key={appt.id}>
                                <td>{appt.doctorName}</td>
                                <td>{appt.doctorSpecialty}</td>
                                <td>{new Date(appt.appointmentDateTime).toLocaleDateString('en-IN')}</td>
                                <td>{new Date(appt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td>
                                    <span className={`status-pill status-${String(appt.status).toLowerCase()}`}>{appt.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {appointments.length === 0 && <p className="no-data-message">This patient has no appointment history.</p>}
            </div>
        </div>
    );
};

export default PatientHistoryPage;