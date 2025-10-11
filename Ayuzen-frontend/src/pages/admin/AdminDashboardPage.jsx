import React, { useEffect, useState } from 'react';
import apiClient from '../../services/authService';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/admin/dashboard-stats');
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
        setError("Could not load dashboard data. Please check server logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <h2>Loading Admin Dashboard...</h2>;
  if (error) return <h2 style={{color: 'red'}}>Error: {error}</h2>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Here are the clinic's stats for today, {new Date().toLocaleDateString()}.</p>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Doctors</h3>
          {/* Use a fallback value if stats is null */}
          <span>{stats?.totalDoctors ?? 'N/A'}</span>
        </div>
        <div className="stat-card">
          <h3>Appointments Today</h3>
          <span>{stats?.appointmentsToday ?? 'N/A'}</span>
        </div>
        <div className="stat-card">
          <h3>Revenue Today</h3>
          {/* This is the key fix: Check before calling toLocaleString and provide a default */}
          <span>₹{(stats?.totalRevenueToday ?? 0).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

