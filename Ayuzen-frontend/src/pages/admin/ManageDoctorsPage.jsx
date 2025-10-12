import React, { useEffect, useState } from 'react';
import apiClient from '../../services/authService';
import './ManageDoctorsPage.css';

const ManageDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect runs once when the component mounts to fetch data
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Make the API call to your Spring Boot backend
        const response = await apiClient.get('/admin/doctors');
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to fetch doctors. Please ensure the backend is running and you are authorized.');
        console.error("Fetch doctors error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []); // The empty array ensures this runs only once

  const handleAddDoctor = () => {
    alert('This will open a form to add a new doctor.');
    // Future implementation: setModalOpen(true);
  };

  const handleEdit = (id) => {
    alert(`This will open a form to edit doctor with ID: ${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      try {
        await apiClient.delete(`/admin/doctors/${id}`);
        // On success, filter out the deleted doctor from the local state
        setDoctors(prevDoctors => prevDoctors.filter(doctor => doctor.id !== id));
        alert('Doctor deleted successfully.');
      } catch (err) {
        alert('Failed to delete doctor.');
        console.error("Delete doctor error:", err);
      }
    }
  };

  // Render a loading state while fetching data
  if (isLoading) {
    return (
        <div className="manage-doctors-page">
            <div className="page-header">
                <h1>Manage Doctors</h1>
            </div>
            <h2>Loading doctor data...</h2>
        </div>
    );
  }

  // Render an error state if the API call fails
  if (error) {
    return <div className="manage-doctors-page"><h2 className="error-message">{error}</h2></div>;
  }

  return (
    <div className="manage-doctors-page">
      <div className="page-header">
        <h1>Manage Doctors</h1>
        <button onClick={handleAddDoctor} className="add-doctor-btn">
          + Add New Doctor
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialty</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.specialty}</td>
                <td>{doctor.email}</td>
                <td>{doctor.contactNumber}</td>
                <td>{doctor.experience} yrs</td>
                <td className="actions">
                  <button onClick={() => handleEdit(doctor.id)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(doctor.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDoctorsPage;
