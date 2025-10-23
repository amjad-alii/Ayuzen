import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../services/authService';
import EPrescriptionPad from './EPrescriptionPad';
import './DoctorPatientHistoryPage.css';

const DoctorPatientHistoryPage = () => {
    const { patientId } = useParams();
    const [patientName, setPatientName] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [writingPrescriptionFor, setWritingPrescriptionFor] = useState(null); // Holds appointment ID

    useEffect(() => {
        fetchHistory();
    }, [patientId]); // Re-fetch if patientId changes

    const fetchHistory = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // CORRECTED API URL: Should be /doctor/patients/...
            const response = await apiClient.get(`/doctors/patients/${patientId}/history`);
            
            // Sort appointments by date, most recent first
            const sortedAppointments = response.data.sort((a, b) => new Date(b.appointmentDateTime) - new Date(a.appointmentDateTime));
            setAppointments(sortedAppointments);
            
            // Set patient name from the first appointment if available
            if (sortedAppointments.length > 0) {
                setPatientName(sortedAppointments[0].patientName);
            } else {
                 setPatientName(`Patient ID: ${patientId}`); // Fallback if no appointments found
            }
        } catch (err) {
            setError('Failed to fetch patient history. Please ensure the backend is running and you are authorized.');
            console.error("Fetch patient history error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Called after a prescription is successfully saved
    const handlePrescriptionSaved = (savedPrescription) => {
        // Update the state more efficiently: only modify the affected appointment
        setAppointments(prev => prev.map(appt => 
            appt.id === savedPrescription.appointmentId 
            ? { ...appt, prescription: savedPrescription } // Add the prescription object to the appointment
            : appt
        ));
        setWritingPrescriptionFor(null); // Close the prescription pad
    };

    if (isLoading) return <h2>Loading Patient History...</h2>;
    if (error) return <h2 className="error-message">{error}</h2>;

    return (
        <div className="patient-history-page">
            <header className="page-header">
                <h1>Appointment History for {patientName}</h1>
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
                                {/* Display existing prescription */}
                                {appt.prescription ? (
                                     <div className="view-prescription">
                                         <h4>Prescription Issued ({appt.prescription.createdAt ? new Date(appt.prescription.createdAt).toLocaleDateString() : 'N/A'}):</h4>
                                         <p><strong>Diagnosis:</strong> {appt.prescription.diagnosis || 'N/A'}</p>
                                         {/* Display medicines - consider formatting if it's JSON */}
                                         <p><strong>Medicines:</strong> {appt.prescription.medicines || 'N/A'}</p>
                                         <p><strong>Advice:</strong> {appt.prescription.advice || 'N/A'}</p>
                                     </div>
                                // Show the form if we are writing for this specific appointment
                                ) : writingPrescriptionFor === appt.id ? (
                                    <EPrescriptionPad 
                                        appointmentId={appt.id}
                                        patientName={appt.patientName}
                                        onSave={handlePrescriptionSaved}
                                        onCancel={() => setWritingPrescriptionFor(null)}
                                    />
                                // Show the "Write" button only if no prescription exists yet and the appointment status is appropriate
                                ) : (
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