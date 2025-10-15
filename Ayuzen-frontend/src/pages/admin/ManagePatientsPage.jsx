import React, { useEffect, useState, useMemo } from 'react';
import apiClient from '../../services/authService';
import './ManagePatientsPage.css'; // We'll create this new CSS file

const ManagePatientsPage = () => {
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for searching and pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiClient.get('/admin/patients');
                setPatients(response.data);
            } catch (err) {
                setError('Failed to fetch patients. Please ensure the backend is running and you are authorized.');
                console.error("Fetch patients error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // Memoize the search results for performance
    const filteredPatients = useMemo(() => {
        return patients.filter(patient =>
            patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [patients, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
    const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when search term changes
    }, [searchTerm]);

    if (isLoading) return <h2>Loading Patient Database...</h2>;
    if (error) return <h2 className="error-message">{error}</h2>;

    return (
        <div className="manage-patients-page">
            <header className="page-header">
                <h1>Patient Database</h1>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="search-input"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </header>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Age</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPatients.map((patient) => (
                            <tr key={patient.id}>
                                <td>{patient.fullName}</td>
                                <td>{patient.email}</td>
                                <td>{patient.phone || 'N/A'}</td>
                                <td>{patient.age}</td>
                                <td className="actions">
                                    <button className="btn-view">View History</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages || 1}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ManagePatientsPage;
