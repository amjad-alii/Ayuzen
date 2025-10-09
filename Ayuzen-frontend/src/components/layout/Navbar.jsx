import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <nav className="navbar" role="navigation" aria-label="Main">
        {/* Brand */}
        <Link to="/" className="brand" onClick={close} aria-label="Ayuzen Home">
          <span className="brand-mark">A</span>
          <span className="brand-name">Ayuzen</span>
        </Link>

        {/* Center links for desktop */}
        <ul className="nav-center">
          <li>
            <NavLink to="/my-appointments" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={close}>
              My Appointments
            </NavLink>
          </li>
          <li>
            <NavLink to="/doctors" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={close}>
              Doctors
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={close}>
              About
            </NavLink>
          </li>
        </ul>

        {/* Right actions for desktop */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              {/* We'll get user data from context later */}
              <span className="greet">Hi, User</span> 
              <button className="btn outline" onClick={logout} aria-label="Logout">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn solid" onClick={close}>Login</Link>
          )}
        </div>

        {/* Hamburger for mobile */}
        <button
          className={`hamburger ${open ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${open ? 'show' : ''}`}>
        <NavLink to="/my-appointments" className="drawer-link" onClick={close}>My Appointments</NavLink>
        <NavLink to="/doctors" className="drawer-link" onClick={close}>Doctors</NavLink>
        <NavLink to="/about" className="drawer-link" onClick={close}>About</NavLink>
        {isAuthenticated ? (
          <button className="btn solid full" onClick={() => { logout(); close(); }}>Logout</button>
        ) : (
          <Link to="/login" className="btn solid full" onClick={close}>Login</Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;