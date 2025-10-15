import React, { useState, useEffect } from 'react';
import './DoctorFormModal.css';

const DoctorFormModal = ({ isOpen, onClose, onSave, doctorToEdit }) => {
    const [formData, setFormData] = useState({
        name: '', specialty: '', email: '', contactNumber: '', qualification: '', experience: ''
    });

    useEffect(() => {
        if (isOpen && doctorToEdit) {
            setFormData(doctorToEdit);
        } else {
            setFormData({ name: '', specialty: '', email: '', contactNumber: '', qualification: '', experience: '' });
        }
    }, [doctorToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{doctorToEdit ? 'Edit Doctor Profile' : 'Add New Doctor'}</h2>
                <form onSubmit={handleSubmit}>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
                    <input name="specialty" value={formData.specialty} onChange={handleChange} placeholder="Specialty" required />
                    <input name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" type="email" required />
                    <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" required />
                    <input name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Qualification (e.g., MBBS, MD)" required />
                    <input name="experience" value={formData.experience} onChange={handleChange} placeholder="Years of Experience" type="number" required />
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorFormModal;