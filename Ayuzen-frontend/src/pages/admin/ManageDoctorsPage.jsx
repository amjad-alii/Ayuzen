import React, { useEffect, useState } from 'react';
import apiClient from '../../services/authService';
import './ManageDoctorsPage.css';

const ManageDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await apiClient.get('/admin/doctors');
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to fetch doctors.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (isLoading) return <h2>Loading Doctors...</h2>;
  if (error) return <h2 className="error-message">{error}</h2>;

  return (
    <div className="manage-doctors-page">
      <div className="page-header">
        <h1>Manage Doctors</h1>
        <button className="add-doctor-btn">Add New Doctor</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialty</th>
              <th>Email</th>
              <th>Contact Number</th>
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
                <td className="actions">
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete">Delete</button>
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