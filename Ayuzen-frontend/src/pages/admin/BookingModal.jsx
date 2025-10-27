import React, { useState, useEffect } from 'react';
import apiClient from '../../services/authService';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose, slotInfo }) => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patientId, setPatientId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Fetch lists for dropdowns when the modal opens
    useEffect(() => {
        if (isOpen) {
            setError(null); // Clear previous errors
            // Fetch patients
            apiClient.get('/admin/patients')
                .then(res => setPatients(res.data))
                .catch(err => {
                    console.error("Failed to fetch patients:", err);
                    setError("Could not load patient list.");
                });
            // Fetch doctors
            apiClient.get('/admin/doctors')
                .then(res => setDoctors(res.data))
                .catch(err => {
                    console.error("Failed to fetch doctors:", err);
                    setError("Could not load doctor list.");
                });
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Prepare data for the backend API
        const bookingData = {
            patientId: parseInt(patientId),
            doctorId: parseInt(doctorId),
            appointmentDateTime: slotInfo.start.toISOString(), // Send ISO string to backend
            notes,
        };

        try {
            await apiClient.post('/admin/appointments/book', bookingData);
            alert('Appointment booked successfully!');
            onClose(true); // Close modal and signal a refresh is needed
        } catch (err) {
            setError('Failed to book appointment. Please try again.');
            console.error("Admin booking error:", err);
            setIsSubmitting(false);
        }
    };

    // Don't render anything if the modal isn't open
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={() => onClose(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Book New Appointment</h2>
                <p>For Slot: <strong>{slotInfo.start.toLocaleString('en-IN')}</strong></p>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="patient-select">Select Patient *</label>
                    <select id="patient-select" value={patientId} onChange={e => setPatientId(e.target.value)} required>
                        <option value="" disabled>-- Select Patient --</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                    </select>

                    <label htmlFor="doctor-select">Select Doctor *</label>
                    <select id="doctor-select" value={doctorId} onChange={e => setDoctorId(e.target.value)} required>
                        <option value="" disabled>-- Select Doctor --</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialty})</option>)}
                    </select>

                    <label htmlFor="notes-textarea">Notes (Optional)</label>
                    <textarea id="notes-textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add any relevant notes..."></textarea>

                    <div className="modal-actions">
                        <button type="button" onClick={() => onClose(false)} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;