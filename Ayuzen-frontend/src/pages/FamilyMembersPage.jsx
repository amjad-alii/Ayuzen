import React, { useEffect, useState } from 'react';
import apiClient from '../services/authService';
import './FamilyMembersPage.css'; // We'll create this CSS file

const FamilyMembersPage = () => {
    const [dependents, setDependents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the "Add New" form
    const [fullName, setFullName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');

    useEffect(() => {
        fetchDependents();
    }, []);

    const fetchDependents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/patient/dependents');
            setDependents(response.data);
        } catch (err) {
            setError('Failed to fetch family members.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddDependent = async (e) => {
        e.preventDefault();
        try {
            const newDependent = { fullName, relationship, gender, age: parseInt(age) };
            await apiClient.post('/patient/dependents', newDependent);
            fetchDependents(); // Refresh the list
            // Clear the form
            setFullName('');
            setRelationship('');
            setGender('');
            setAge('');
        } catch (err) {
            alert('Failed to add dependent. Please check the details and try again.');
        }
    };

    const handleDeleteDependent = async (id) => {
        if (window.confirm('Are you sure you want to remove this family member?')) {
            try {
                await apiClient.delete(`/patient/dependents/${id}`);
                fetchDependents(); // Refresh the list
            } catch (err) {
                alert('Failed to remove dependent.');
            }
        }
    };

    return (
        <div className="family-page-container">
            <h1>My Family Members</h1>
            <p>Manage family members to book appointments on their behalf.</p>

            {/* Add New Dependent Form */}
            <div className="form-section">
                <h2>Add a New Member</h2>
                <form onSubmit={handleAddDependent} className="dependent-form">
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" required />
                    <input type="text" value={relationship} onChange={e => setRelationship(e.target.value)} placeholder="Relationship (e.g., Child)" required />
                    <select value={gender} onChange={e => setGender(e.target.value)} required>
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" required />
                    <button type="submit">Add Member</button>
                </form>
            </div>

            {/* List of Dependents */}
            <div className="list-section">
                <h2>Your Family</h2>
                {isLoading ? (
                    <p>Loading family members...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <div className="dependent-list">
                        {dependents.length === 0 ? (
                            <p>You have not added any family members yet.</p>
                        ) : (
                            dependents.map(dep => (
                                <div key={dep.id} className="dependent-card">
                                    <div className="card-info">
                                        <strong>{dep.fullName}</strong>
                                        <span>({dep.relationship})</span>
                                        <span>{dep.gender}, {dep.age} years old</span>
                                    </div>
                                    <button onClick={() => handleDeleteDependent(dep.id)} className="delete-btn">Remove</button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FamilyMembersPage;