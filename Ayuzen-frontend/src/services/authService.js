import axios from 'axios';

// Create an Axios instance to communicate with your Spring Boot backend
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // The base URL of your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * @param {object} signUpData - The user's registration details.
 * @returns {Promise<object>} The newly created user data.
 */
export const signUpApi = async (signUpData) => {
  try {
    const response = await apiClient.post('/auth/signup', signUpData);
    return response.data;
  } catch (error) {
    // Throw an error to be caught by the component
    throw new Error(error.response?.data?.message || 'Sign up failed. Please try again.');
  }
};

/**
 * @param {object} loginData - The user's email and password.
 * @returns {Promise<string>} The JWT token.
 */
export const loginApi = async (loginData) => {
  try {
    const response = await apiClient.post('/auth/login', loginData);
    const token = response.data;

    if (token) {
      // Store the token for future requests
      localStorage.setItem('authToken', token);
      // Set the token on the Axios instance for all subsequent requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return token;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid credentials. Please try again.');
  }
};

/**
 * Logs the user out by removing the token.
 */
export const logoutApi = () => {
  localStorage.removeItem('authToken');
  delete apiClient.defaults.headers.common['Authorization'];
};

export default apiClient;