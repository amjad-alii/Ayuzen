import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enIN from 'date-fns/locale/en-IN'; // 1. IMPORT the locale at the top
import 'react-big-calendar/lib/css/react-big-calendar.css';
import apiClient from '../../services/authService';
import BookingModal from './BookingModal';
import './ClinicCalendarPage.css';

// 2. Define the locales object using the imported module
const locales = {
  'en-IN': enIN,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const ClinicCalendarPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await apiClient.get('/admin/appointments');
            setAppointments(response.data);
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
        }
    };
    
    // Transform appointments into the format react-big-calendar expects
    const events = useMemo(() => appointments.map(appt => ({
        title: `${appt.patientName} with Dr. ${appt.doctorName}`,
        start: new Date(appt.appointmentDateTime),
        end: new Date(new Date(appt.appointmentDateTime).getTime() + 30 * 60000), // Assuming 30 min slots
        resource: appt, // Store original appointment data
    })), [appointments]);

    const handleSelectSlot = (slotInfo) => {
        // Only allow booking for future slots
        if (slotInfo.start < new Date()) {
            return;
        }
        setSelectedSlot(slotInfo);
        setIsModalOpen(true);
    };
    
    const handleModalClose = (didBook) => {
        setIsModalOpen(false);
        setSelectedSlot(null);
        if (didBook) {
            fetchAppointments(); // Refresh appointments if a new one was booked
        }
    };

    return (
        <div className="calendar-page-container">
            <header className="page-header">
                <h1>Clinic Master Calendar</h1>
            </header>
            <div className="calendar-container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '75vh' }}
                    selectable={true}
                    onSelectSlot={handleSelectSlot}
                    defaultView="week"
                    views={['month', 'week', 'day']}
                />
            </div>
            {isModalOpen && (
                <BookingModal 
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    slotInfo={selectedSlot}
                />
            )}
        </div>
    );
};

export default ClinicCalendarPage;
