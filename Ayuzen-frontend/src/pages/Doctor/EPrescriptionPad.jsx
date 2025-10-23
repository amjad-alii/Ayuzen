import React, { useState } from 'react';
import apiClient from '../../services/authService';
import './EPrescriptionPad.css'; // We'll create this CSS

const EPrescriptionPad = ({ appointmentId, patientName, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        diagnosis: '',
        medicines: '', // Store medicines as a simple text block for now
        advice: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await apiClient.post(`/doctors/appointments/${appointmentId}/prescriptions`, formData);
            onSave(response.data); // Pass the saved prescription back to the parent
        } catch (err) {
            alert('Failed to save prescription.');
            console.error("Prescription save error:", err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="prescription-pad">
            <h3>New Prescription for {patientName}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="diagnosis">Diagnosis</label>
                    <textarea id="diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} rows="3"></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="medicines">Medicines (Include Name, Dosage, Duration)</label>
                    <textarea id="medicines" name="medicines" value={formData.medicines} onChange={handleChange} rows="5" required></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="advice">Advice / Notes</label>
                    <textarea id="advice" name="advice" value={formData.advice} onChange={handleChange} rows="3"></textarea>
                </div>
                <div className="pad-actions">
                    <button type="button" onClick={onCancel} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Prescription'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EPrescriptionPad;