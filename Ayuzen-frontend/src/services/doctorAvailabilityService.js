import apiClient from './authService'; // Reuse the configured axios instance

/**
 * Fetches the doctor's weekly availability rules.
 */
export const getAvailabilityRulesApi = async () => {
    const response = await apiClient.get('/doctors/availability/rules');
    return response.data;
};

/**
 * Updates the doctor's weekly availability rules.
 * @param {Array} rules - An array of rule objects ({ dayOfWeek, startTime, endTime }).
 */
export const setAvailabilityRulesApi = async (rules) => {
    const response = await apiClient.put('/doctors/availability/rules', rules);
    return response.data;
};

/**
 * Fetches the doctor's specific time blocks (unavailability).
 */
export const getTimeBlocksApi = async () => {
    const response = await apiClient.get('/doctors/availability/blocks');
    return response.data;
};

/**
 * Adds a new time block (unavailability).
 * @param {object} blockData - The details of the block ({ startTime, endTime, reason }).
 */
export const addTimeBlockApi = async (blockData) => {
    const response = await apiClient.post('/doctors/availability/blocks', blockData);
    return response.data;
};

/**
 * Deletes a specific time block by its ID.
 * @param {number} blockId - The ID of the time block to delete.
 */
export const deleteTimeBlockApi = async (blockId) => {
    await apiClient.delete(`/doctors/availability/blocks/${blockId}`);
};