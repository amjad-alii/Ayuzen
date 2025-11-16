import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import apiClient from '../services/authService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './DoctorProfilePage.css';
import Button from '../components/common/Button';

const DoctorProfilePage = () => {
    const { doctorId } = useParams();
    const { isAuthenticated, user } = useAuth(); // Get the logged-in user
    const { bookAppointment } = useAppointments();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSlotsLoading, setIsSlotsLoading] = useState(false);
    
    // --- NEW STATE FOR FAMILY MEMBERS ---
    const [dependents, setDependents] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState('myself'); // 'myself' or a dependent's ID

    // Fetch doctor profile
    useEffect(() => {
        const fetchDoctorProfile = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(`/public/doctors/${doctorId}`);
                setDoctor(response.data);
            } catch (err) { console.error("Failed to fetch doctor profile", err); }
            finally { setIsLoading(false); }
        };
        fetchDoctorProfile();
    }, [doctorId]);

    // Fetch available slots when date changes
    useEffect(() => {
        if (!doctorId) return;
        const fetchSlots = async () => {
            setIsSlotsLoading(true);
            setSelectedSlot(null);
            try {
                const dateString = selectedDate.toISOString().split('T')[0];
                const response = await apiClient.get(`/public/doctors/${doctorId}/availability?date=${dateString}`);
                setAvailableSlots(response.data);
            } catch (err) { setAvailableSlots([]); }
            finally { setIsSlotsLoading(false); }
        };
        fetchSlots();
    }, [selectedDate, doctorId]);

    // --- NEW EFFECT: Fetch dependents when user is authenticated ---
    useEffect(() => {
        if (isAuthenticated) {
            apiClient.get('/patient/dependents')
                .then(res => setDependents(res.data))
                .catch(err => console.error("Failed to fetch dependents", err));
        }
    }, [isAuthenticated]);

    // Handle the final booking
    const handleBooking = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!selectedSlot) {
            alert("Please select a time slot.");
            return;
        }

        try {
            await bookAppointment({
                doctorId: doctor.id,
                appointmentDateTime: selectedSlot,
                doctorName: doctor.name,
                doctorSpecialty: doctor.specialty,
                // THIS IS THE NEW PART
                dependentId: selectedPatientId === 'myself' ? null : parseInt(selectedPatientId)
            });
            alert(`Booking confirmed with Dr. ${doctor.name}!`);
            navigate('/my-appointments');
        } catch (err) {
            alert("Failed to create appointment.");
        }
    };

    if (isLoading) return <h2>Loading Doctor Profile...</h2>;
    if (!doctor) return <h2>Doctor not found.</h2>;

    return (
        <div className="profile-container">
            {/* ... Doctor Profile Header remains the same ... */}
            
            <div className="profile-body booking-flow">
                {/* Step 1: Select Date */}
                <div className="booking-step">
                    <h3>1. Select a Date</h3>
                    <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} minDate={new Date()} inline />
                </div>

                {/* Step 2: Select Time */}
                <div className="booking-step">
                    <h3>2. Select an Available Time</h3>
                    {isSlotsLoading ? <p>Loading available slots...</p> : (
                        <div className="time-slot-grid">
                            {availableSlots.length > 0 ? availableSlots.map((slot) => (
                                <button
                                    key={slot}
                                    className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                                    onClick={() => setSelectedSlot(slot)}
                                >
                                    {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </button>
                            )) : <p>No available slots for this day.</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* --- NEW STEP 3: Select Patient --- */}
            {isAuthenticated && (
                <div className="booking-step select-patient-step">
                    <h3>3. Who is this appointment for?</h3>
                    <select 
                        className="patient-select-dropdown" 
                        value={selectedPatientId} 
                        onChange={e => setSelectedPatientId(e.target.value)}
                    >
                        <option value="myself">Myself ({user.fullName})</option>
                        {dependents.map(dep => (
                            <option key={dep.id} value={dep.id}>{dep.fullName} ({dep.relationship})</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Final Step: Confirm Booking */}
            <div className="confirm-section">
                <Button onClick={handleBooking} disabled={!selectedSlot || isSlotsLoading}>
                    {isAuthenticated ? 'Confirm Booking' : 'Login to Book'}
                </Button>
            </div>
        </div>
    );
};

export default DoctorProfilePage;