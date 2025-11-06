import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../services/authService';
import EPrescriptionPad from './EPrescriptionPad';
import './ConsultationPage.css'; // We'll create this CSS file
import './DoctorPatientHistoryPage.css'; // Reuse styles from history page

const ConsultationPage = () => {
    // Get both IDs from the URL
    const { patientId, appointmentId } = useParams(); 
    
    const [patientName, setPatientName] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch the patient's appointment history
                const response = await apiClient.get(`/doctor/patients/${patientId}/history`);
                const sortedAppointments = response.data.sort((a, b) => new Date(b.appointmentDateTime) - new Date(a.appointmentDateTime));
                setAppointments(sortedAppointments);
                
                if (sortedAppointments.length > 0) {
                    setPatientName(sortedAppointments[0].patientName);
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

    const handlePrescriptionSaved = (savedPrescription) => {
        alert('Prescription saved successfully!');
        // Optionally, refresh history to show the new prescription
        fetchHistory();
    };

    if (isLoading) return <h2>Loading Consultation...</h2>;
    if (error) return <h2 className="error-message">{error}</h2>;

    return (
        <div className="consultation-page">
            <header className="page-header">
                <h1>Consultation for {patientName}</h1>
                <Link to="/doctor/dashboard" className="back-button">← Back to Schedule</Link>
            </header>

            <div className="consultation-layout">
                {/* Column 1: Patient History */}
                <div className="patient-history-column">
                    <h3>Patient History</h3>
                    <div className="history-list">
                        {appointments.length > 0 ? (
                            appointments.map((appt) => (
                                <div key={appt.id} className={`history-card status-${String(appt.status).toLowerCase()}`}>
                                    <div className="history-card-header">
                                        <span className="history-date">{new Date(appt.appointmentDateTime).toLocaleDateString('en-IN')}</span>
                                        <span className={`status-pill status-${String(appt.status).toLowerCase()}`}>{appt.status}</span>
                                    </div>
                                    <p><strong>Notes:</strong> {appt.notes || 'No notes recorded.'}</p>
                                    
                                    {/* Display existing prescription */}
                                    {appt.prescription && (
                                        <div className="view-prescription">
                                            <h4>Prescription Issued:</h4>
                                            <p><strong>Diagnosis:</strong> {appt.prescription.diagnosis || 'N/A'}</p>
                                            <pre><strong>Medicines:</strong> {appt.prescription.medicines || 'N/A'}</pre>
                                            <p><strong>Advice:</strong> {appt.prescription.advice || 'N/A'}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No prior appointment history with this patient.</p>
                        )}
                    </div>
                </div>

                {/* Column 2: E-Prescription Pad */}
                <div className="prescription-pad-column">
                    <EPrescriptionPad 
                        appointmentId={appointmentId}
                        patientName={patientName}
                        onSave={handlePrescriptionSaved}
                        onCancel={() => {}} // Cancel is handled inside the component
                    />
                </div>
            </div>
        </div>
    );
};

export default ConsultationPage;