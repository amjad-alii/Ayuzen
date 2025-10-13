import React, { useEffect, useState, useMemo } from 'react';
import apiClient from '../../services/authService';
import './ClinicAppointmentsPage.css'; // We'll create a dedicated CSS file

const ClinicAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for filtering and searching
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/admin/appointments');
            setAppointments(response.data);
        } catch (err) {
            setError('Failed to fetch appointments. Please ensure the backend is running and you are authorized.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleStatusUpdate = async (id, status) => {
        try {
            const response = await apiClient.put(`/admin/appointments/${id}/status?status=${status}`);
            // Update the local state for an instant UI change
            setAppointments(prev => prev.map(appt => appt.id === id ? response.data : appt));
        } catch (err) {
            alert(`Failed to update status for appointment ID: ${id}`);
        }
    };

    // Memoize the filtered appointments to avoid re-calculating on every render
    const filteredAppointments = useMemo(() => {
        return appointments
            .filter(appt => {
                if (statusFilter === 'ALL') return true;
                return appt.status === statusFilter;
            })
            .filter(appt =>
                appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appt.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [appointments, searchTerm, statusFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1); // Reset to first page whenever filters change
    }, [searchTerm, statusFilter]);

    if (isLoading) return <h2>Loading All Clinic Appointments...</h2>;
    if (error) return <h2 className="error-message">{error}</h2>;

    return (
        <div className="appointments-page-container">
            <header className="page-header">
                <h1>All Clinic Appointments</h1>
            </header>

            {/* Filter and Search Controls */}
            <div className="filter-controls">
                <input
                    type="text"
                    placeholder="Search by patient or doctor..."
                    className="search-input"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Doctor Name</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedAppointments.map((appt) => (
                            <tr key={appt.id}>
                                <td>{appt.patientName}</td>
                                <td>{appt.doctorName}</td>
                                <td>{new Date(appt.appointmentDateTime).toLocaleString('en-IN')}</td>
                                <td>
                                    <span className={`status-pill status-${String(appt.status).toLowerCase()}`}>{appt.status}</span>
                                </td>
                                <td className="actions">
                                    {appt.status === 'PENDING' && (
                                        <button onClick={() => handleStatusUpdate(appt.id, 'CONFIRMED')} className="btn-confirm">Confirm</button>
                                    )}
                                    {appt.status === 'CONFIRMED' && (
                                        <button onClick={() => handleStatusUpdate(appt.id, 'CANCELLED')} className="btn-cancel">Cancel</button>
                                    )}
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
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ClinicAppointmentsPage;