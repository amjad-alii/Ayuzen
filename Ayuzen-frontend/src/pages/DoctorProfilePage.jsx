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
    const { isAuthenticated } = useAuth();
    const { bookAppointment } = useAppointments(); // From patient's context
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSlotsLoading, setIsSlotsLoading] = useState(false);
    
    // 1. Fetch the doctor's profile on component load
    useEffect(() => {
        const fetchDoctorProfile = async () => {
            setIsLoading(true);
            try {
                // Calls the public endpoint
                const response = await apiClient.get(`/public/doctors/${doctorId}`);
                setDoctor(response.data);
            } catch (err) {
                console.error("Failed to fetch doctor profile", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctorProfile();
    }, [doctorId]);

    // 2. Fetch available slots whenever the selectedDate changes
    useEffect(() => {
        if (!doctorId) return;

        const fetchSlots = async () => {
            setIsSlotsLoading(true);
            setSelectedSlot(null); // Reset selected slot
            try {
                const dateString = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                const response = await apiClient.get(`/public/doctors/${doctorId}/availability?date=${dateString}`);
                setAvailableSlots(response.data);
            } catch (err) {
                console.error("Failed to fetch slots", err);
                setAvailableSlots([]);
            } finally {
                setIsSlotsLoading(false);
            }
        };
        fetchSlots();
    }, [selectedDate, doctorId]);

    // 3. Handle the final booking
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
                doctorSpecialty: doctor.specialty
            });
            alert(`Booking confirmed with Dr. ${doctor.name} at ${new Date(selectedSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}!`);
            navigate('/my-appointments');
        } catch (err) {
            alert("Failed to create appointment.");
        }
    };

    if (isLoading) return <h2>Loading Doctor Profile...</h2>;
    if (!doctor) return <h2>Doctor not found.</h2>;

    return (
        <div className="profile-container">
            {/* Doctor Profile Header */}
            <div className="profile-header">
                <img src={doctor.imageUrl || "https://cdn.jsdelivr.net/gh/AmjadAli9/assets/doctor-avatar.svg"} alt={`Dr. ${doctor.name}`} className="profile-image" />
                <div className="profile-header-info">
                    <h1>Dr. {doctor.name}</h1>
                    <p className="specialty">{doctor.specialty}</p>
                    <p className="location">{doctor.qualification} - {doctor.experience} years experience</p>
                </div>
            </div>
            
            <div className="profile-body booking-flow">
                {/* Step 1: Select Date */}
                <div className="booking-step">
                    <h3>1. Select a Date</h3>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        minDate={new Date()} // Can't book in the past
                        inline 
                    />
                </div>

                {/* Step 2: Select Time */}
                <div className="booking-step">
                    <h3>2. Select an Available Time</h3>
                    {isSlotsLoading ? (
                        <p>Loading available slots...</p>
                    ) : (
                        <div className="time-slot-grid">
                            {availableSlots.length > 0 ? availableSlots.map((slot) => {
                                const slotTime = new Date(slot);
                                return (
                                    <button
                                        key={slot}
                                        className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                                        onClick={() => setSelectedSlot(slot)}
                                    >
                                        {slotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </button>
                                );
                            }) : (
                                <p>No available slots for this day. Please select another date.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Step 3: Confirm Booking */}
            <div className="confirm-section">
                <Button onClick={handleBooking} disabled={!selectedSlot || isSlotsLoading}>
                    {isAuthenticated ? 'Confirm Booking' : 'Login to Book'}
                </Button>
            </div>
        </div>
    );
};

export default DoctorProfilePage;