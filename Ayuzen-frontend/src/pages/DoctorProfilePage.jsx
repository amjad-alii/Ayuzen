import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import apiClient from '../services/authService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './DoctorProfilePage.css';
import Button from '../components/common/Button';

const DEFAULT_FEE = 500; 

const DoctorProfilePage = () => {
    const { doctorId } = useParams();
    const { isAuthenticated, user } = useAuth();
    const { bookAppointment } = useAppointments();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSlotsLoading, setIsSlotsLoading] = useState(false);
    const [dependents, setDependents] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState('myself');
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    
    // --- LOAD RAZORPAY SCRIPT ---
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        return () => { document.body.removeChild(script); };
    }, []);
    
    // --- FETCH DOCTOR PROFILE (and FEE) ---
    useEffect(() => {
        const fetchDoctorProfile = async () => {
            setIsLoading(true);
            try {
                // Calls the public endpoint for doctor details
                const response = await apiClient.get(`/public/doctors/${doctorId}`);
                setDoctor(response.data);
            } catch (err) { console.error("Failed to fetch doctor profile", err); }
            finally { setIsLoading(false); }
        };
        fetchDoctorProfile();
    }, [doctorId]);

    // --- FETCH DEPENDENTS ---
    useEffect(() => {
        if (isAuthenticated) {
            apiClient.get('/api/patient/dependents')
                .then(res => setDependents(res.data))
                .catch(err => console.error("Failed to fetch dependents", err));
        }
    }, [isAuthenticated]);

    // --- FETCH SLOTS ---
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


    // --- HANDLE PAYMENT AND BOOKING ---
    const handlePaymentAndBooking = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!selectedSlot || isPaymentProcessing) {
            return;
        }
        
        setIsPaymentProcessing(true);
        const doctorFee = doctor?.fee || DEFAULT_FEE;
        
        const bookingDataForOrder = {
            doctorId: doctor.id,
            appointmentDateTime: selectedSlot, // ISO String
            dependentId: selectedPatientId === 'myself' ? null : parseInt(selectedPatientId),
            fee: doctorFee // Send fee to the backend to create the order
        };

        try {
            const orderResponse = await apiClient.post('api/payment/create-order', bookingDataForOrder);
            
            const orderResponseData = orderResponse.data;
            
            const options = {
                key: orderResponseData.key_id, 
                amount: orderResponseData.amount_paisa, // Amount in paisa
                currency: "INR",
                name: "Ayuzen Clinic",
                description: `Consultation with Dr. ${doctor.name}`,
                order_id: orderResponseData.order_id,
                
                // --- STEP 2: PAYMENT SUCCESS CALLBACK (Frontend) ---
                handler: async function (response) {
                    const verificationData = {
                        // Razorpay signature details
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                        
                        // Original booking details for final creation
                        doctorId: doctor.id,
                        appointmentDateTime: selectedSlot,
                        dependentId: bookingDataForOrder.dependentId,
                    };

                    try {
                        // Final API call to verify signature and confirm the appointment in DB
                        await apiClient.post('/payment/verify-and-book', verificationData);
                        
                        // Update patient state (simulating successful booking)
                        await bookAppointment(verificationData); 
                        
                        alert("Payment successful and booking confirmed!");
                        navigate('/my-appointments');
                        
                    } catch (error) {
                        alert("Verification Failed. Please contact support with payment ID: " + response.razorpay_payment_id);
                    }
                },
                prefill: {
                    name: user.fullName,
                    email: user.sub, 
                },
                theme: { color: "#0d9488" }
            };

            // Open the Razorpay Modal
            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                alert("Payment failed: " + response.error.description);
                console.error(response.error);
            });
            paymentObject.open();

        } catch (error) {
            console.error("Payment initiation failed:", error);
            // This alert is being shown because the backend returned a non-200 status (e.g., 400 Bad Request)
            alert("Could not start payment. Check your Spring Boot console for the reason.");
        } finally {
            setIsPaymentProcessing(false);
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
                        minDate={new Date()} 
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

            {/* Final Step: Pay and Confirm Booking */}
            <div className="confirm-section">
                <Button onClick={handlePaymentAndBooking} disabled={!selectedSlot || isSlotsLoading || isPaymentProcessing}>
                    {isAuthenticated ? (isPaymentProcessing ? 'Processing Payment...' : `Pay ₹${doctor?.fee || DEFAULT_FEE} & Confirm`) : 'Login to Book'}
                </Button>
            </div>
        </div>
    );
};

export default DoctorProfilePage;