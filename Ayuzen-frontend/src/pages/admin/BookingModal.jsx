import React, { useState, useEffect } from 'react';
import apiClient from '../../services/authService';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose, slotInfo }) => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patientId, setPatientId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Fetch patients and doctors when modal opens
            apiClient.get('/admin/patients').then(res => setPatients(res.data));
            apiClient.get('/admin/doctors').then(res => setDoctors(res.data));
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const bookingData = {
            patientId: parseInt(patientId),
            doctorId: parseInt(doctorId),
            appointmentDateTime: slotInfo.start.toISOString(),
            notes,
        };
        try {
            await apiClient.post('/admin/appointments/book', bookingData);
            alert('Appointment booked successfully!');
            onClose(true); // Close modal and signal a refresh
        } catch (err) {
            alert('Failed to book appointment.');
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Book Appointment</h2>
                <p>For: {slotInfo.start.toLocaleString()}</p>
                <form onSubmit={handleSubmit}>
                    <select value={patientId} onChange={e => setPatientId(e.target.value)} required>
                        <option value="">Select Patient</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                    </select>
                    <select value={doctorId} onChange={e => setDoctorId(e.target.value)} required>
                        <option value="">Select Doctor</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                    </select>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)"></textarea>
                    <div className="modal-actions">
                        <button type="button" onClick={() => onClose(false)}>Cancel</button>
                        <button type="submit">Confirm Booking</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;