    import apiClient from './authService'; // We reuse the configured axios instance from our auth service

    /**
     * Fetches all appointments for the currently logged-in user.
     * @returns {Promise<Array>} A promise that resolves to the user's appointments.
     */
    export const getAppointmentsApi = async () => {
      const response = await apiClient.get('/appointments/me');
      return response.data;
    };

    /**
     * Creates a new appointment.
     * @param {object} bookingData - The details for the new appointment (doctorId, dateTime, etc.).
     * @returns {Promise<object>} A promise that resolves to the newly created appointment.
     */
    export const createAppointmentApi = async (bookingData) => {
      const response = await apiClient.post('/appointments', bookingData);
      return response.data;
    };

    /**
     * Sends a request to cancel an appointment by its ID.
     * @param {number} appointmentId - The ID of the appointment to cancel.
     */
    export const cancelAppointmentApi = async (appointmentId) => {
      // The backend returns no content on success, so we don't need to return anything.
      await apiClient.delete(`/appointments/${appointmentId}`);
    };
    