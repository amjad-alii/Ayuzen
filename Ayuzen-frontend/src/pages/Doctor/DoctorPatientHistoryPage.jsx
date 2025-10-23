import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../services/authService';
import EPrescriptionPad from './EPrescriptionPad'; // Import the new component
import './DoctorPatientHistoryPage.css';

const DoctorPatientHistoryPage = () => {
    const { patientId } = useParams();
    const [patientName, setPatientName] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State to manage which prescription pad is open
    const [writingPrescriptionFor, setWritingPrescriptionFor] = useState(null); // Holds appointment ID

    useEffect(() => {
        fetchHistory();
    }, [patientId]);

    const fetchHistory = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/doctors/patients/${patientId}/history`);
            // Sort appointments by date, most recent first
            const sortedAppointments = response.data.sort((a, b) => new Date(b.appointmentDateTime) - new Date(a.appointmentDateTime));
            setAppointments(sortedAppointments);
            if (sortedAppointments.length > 0) {
                setPatientName(sortedAppointments[0].patientName);
            }
        } catch (err) {
            setError('Failed to fetch patient history.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrescriptionSaved = (savedPrescription) => {
        // Optionally update the appointment in state to show prescription exists
        console.log("Prescription saved:", savedPrescription);
        setWritingPrescriptionFor(null); // Close the pad
        // We could ideally fetch just the updated appointment, but refetching all is simpler for now
        fetchHistory(); 
    };

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
                            
                            {/* --- Prescription Section --- */}
                            <div className="prescription-section">
                                {appt.prescription ? ( // Check if a prescription exists (needs backend to send this)
                                     <div className="view-prescription">
                                         <h4>Prescription Issued:</h4>
                                         <p><strong>Diagnosis:</strong> {appt.prescription.diagnosis}</p>
                                         <p><strong>Medicines:</strong> {appt.prescription.medicines}</p>
                                     </div>
                                ) : writingPrescriptionFor === appt.id ? (
                                    <EPrescriptionPad 
                                        appointmentId={appt.id}
                                        patientName={appt.patientName}
                                        onSave={handlePrescriptionSaved}
                                        onCancel={() => setWritingPrescriptionFor(null)}
                                    />
                                ) : (
                                    // Only show button if appointment is completed or confirmed (adjust as needed)
                                    (appt.status === 'COMPLETED' || appt.status === 'CONFIRMED') &&
                                    <button 
                                        className="write-prescription-btn" 
                                        onClick={() => setWritingPrescriptionFor(appt.id)}
                                    >
                                        Write Prescription
                                    </button>
                                )}
                            </div>
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