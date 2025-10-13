import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">Clinic Admin</div>
        <nav>
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/doctors" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Manage Doctors
          </NavLink>
          <NavLink to="/admin/appointments" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Appointments
          </NavLink>

          <NavLink to="/admin/calendar" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>Calendar View</NavLink> 
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
