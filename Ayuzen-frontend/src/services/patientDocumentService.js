import apiClient from './authService';

/**
 * Fetches all documents for the logged-in patient.
 */
export const getDocumentsApi = () => {
    return apiClient.get('/patient/documents');
};

/**
 * Uploads a new document.
 * @param {File} file - The file to upload.
 */
export const uploadDocumentApi = (file) => {
    // We must use FormData to send files
    const formData = new FormData();
    formData.append('file', file); // The key "file" must match @RequestParam("file")

    return apiClient.post('/patient/documents/upload', formData, {
        headers: {
            // This header is crucial for file uploads
            'Content-Type': 'multipart/form-data',
        },
    });
};