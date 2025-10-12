import React, { useEffect, useState } from 'react';
import apiClient from '../../services/authService';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/admin/dashboard');
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
        setError("Could not load dashboard data. Please ensure the backend is running and you are authorized.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <p>Loading stats for today...</p>
        </header>
        <div className="stats-grid">
          <div className="stat-card skeleton"></div>
          <div className="stat-card skeleton"></div>
          <div className="stat-card skeleton"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="admin-dashboard error-message">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Today is {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
      </header>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Doctors</h3>
          <span className="stat-value">{stats?.totalDoctors ?? '0'}</span>
          <p className="stat-description">Currently active on the platform</p>
        </div>
        <div className="stat-card">
          <h3>Appointments Today</h3>
          <span className="stat-value">{stats?.appointmentsToday ?? '0'}</span>
          <p className="stat-description">Scheduled for today</p>
        </div>
        <div className="stat-card">
          <h3>Revenue Today</h3>
          <span className="stat-value">₹{(stats?.totalRevenueToday ?? 0).toLocaleString('en-IN')}</span>
          <p className="stat-description">From confirmed appointments</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
