import React, { useState, useEffect } from 'react';
import { getDocumentsApi, uploadDocumentApi } from '../services/patientDocumentService';
import './MyDocumentsPage.css'; // We'll create this CSS file

const MyDocumentsPage = () => {
    const [documents, setDocuments] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getDocumentsApi();
            setDocuments(response.data);
        } catch (err) {
            setError('Failed to fetch documents.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            await uploadDocumentApi(selectedFile);
            alert('File uploaded successfully!');
            setSelectedFile(null); // Clear the file input
            document.getElementById('file-input').value = null; // Reset the input field
            fetchDocuments(); // Refresh the list of documents
        } catch (err) {
            setError('File upload failed. Please try again.');
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="my-documents-page">
            <h1>My Health Records</h1>
            
            {/* --- Upload Section --- */}
            <div className="upload-section">
                <h2>Upload a New Document</h2>
                <p>Add lab reports, X-rays, or old prescriptions (PDF, PNG, JPG).</p>
                <div className="upload-form">
                    <input 
                        type="file" 
                        id="file-input" 
                        onChange={handleFileChange} 
                        accept=".pdf,.png,.jpg,.jpeg"
                    />
                    <button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                        {isUploading ? 'Uploading...' : 'Upload File'}
                    </button>
                </div>
            </div>

            {/* --- Document List Section --- */}
            <div className="document-list-section">
                <h2>My Uploaded Documents</h2>
                {isLoading ? (
                    <p>Loading documents...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <div className="document-list">
                        {documents.length === 0 ? (
                            <p>You have not uploaded any documents yet.</p>
                        ) : (
                            documents.map(doc => (
                                <a 
                                    key={doc.id} 
                                    href={doc.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="document-item"
                                >
                                    <span className="file-icon">📄</span>
                                    <span className="file-name">{doc.fileName}</span>
                                    <span className="file-date">
                                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                                    </span>
                                </a>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyDocumentsPage;