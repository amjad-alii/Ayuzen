import React from 'react';
    import { NavLink, Outlet } from 'react-router-dom';
    import './AdminLayout.css';

    const AdminLayout = () => {
      return (
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <div className="admin-brand">Clinic Admin</div>
            <nav>
              <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
              <NavLink to="/admin/doctors" className={({isActive}) => isActive ? 'active' : ''}>Manage Doctors</NavLink>
              <NavLink to="/admin/appointments" className={({isActive}) => isActive ? 'active' : ''}>Appointments</NavLink>
            </nav>
          </aside>
          <main className="admin-content">
            {/* This Outlet renders the specific admin page like the dashboard */}
            <Outlet />
          </main>
        </div>
      );
    };

    export default AdminLayout;
    
