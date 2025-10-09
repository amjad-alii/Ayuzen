    import React, { createContext, useState, useContext, useEffect } from 'react';
    import { useAuth } from './AuthContext';
    import { getAppointmentsApi, createAppointmentApi, cancelAppointmentApi } from '../services/appointmentService';

    // 1. Create the Context
    const AppointmentContext = createContext(null);

    // 2. Create the Provider Component
    export const AppointmentProvider = ({ children }) => {
      const [appointments, setAppointments] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);
      const { isAuthenticated } = useAuth();

      // This effect automatically fetches appointments when a user logs in
      // and clears them when they log out.
      useEffect(() => {
        if (isAuthenticated) {
          fetchAppointments();
        } else {
          setAppointments([]); // Clear data on logout
        }
      }, [isAuthenticated]);

      // Function to fetch all appointments from the backend
      const fetchAppointments = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getAppointmentsApi();
          setAppointments(data);
        } catch (err) {
          setError('Failed to fetch appointments.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      
      // Function to book a new appointment
      const bookAppointment = async (appointmentDetails) => {
        setIsLoading(true);
        try {
          const newAppointment = await createAppointmentApi(appointmentDetails);
          setAppointments(prev => [...prev, newAppointment]); // Add new appointment to state
        } catch (err) {
          setError('Failed to book appointment.');
          throw err; // Re-throw error for the component to handle (e.g., show an alert)
        } finally {
          setIsLoading(false);
        }
      };

      // Function to cancel an appointment
      const cancelAppointment = async (appointmentId) => {
        setIsLoading(true);
        try {
          await cancelAppointmentApi(appointmentId);
          // Update the status of the appointment in the local state for an instant UI update
          setAppointments(prev =>
            prev.map(appt =>
              appt.id === appointmentId ? { ...appt, status: 'CANCELLED' } : appt
            )
          );
        } catch (err) {
          setError('Failed to cancel appointment.');
          throw err; // Re-throw error for the component to handle
        } finally {
          setIsLoading(false);
        }
      };
      
      // The value provided to all consumer components
      const value = {
        appointments,
        isLoading,
        error,
        fetchAppointments,
        bookAppointment,
        cancelAppointment,
      };

      return (
        <AppointmentContext.Provider value={value}>
          {children}
        </AppointmentContext.Provider>
      );
    };

    // 3. Create a custom hook for easy access
    export const useAppointments = () => {
      return useContext(AppointmentContext);
    };