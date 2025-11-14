import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  // --- IMPROVEMENT 1: Get the user's role and name ---
  // Get the first name from the 'fullName' claim in the JWT
  const firstName = user?.fullName?.split(' ')[0] || 'User';
  // Get the role from the 'authorities' array in the JWT
  const userRole = user?.authorities?.[0];

  // --- IMPROVEMENT 2: Define links based on role ---
  const renderNavLinks = (isMobile = false) => {
    const linkClass = isMobile ? "drawer-link" : "nav-item";
    const activeClass = isMobile ? "active-mobile" : "active"; // Mobile might not have active styling

    return (
      <>
        {/* Public links everyone can see */}
        <li>
          <NavLink to="/doctors" className={({isActive}) => `${linkClass} ${isActive ? activeClass : ''}`} onClick={close}>
            Doctors
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({isActive}) => `${linkClass} ${isActive ? activeClass : ''}`} onClick={close}>
            About
          </NavLink>
        </li>
        
        {/* Role-specific links */}
        {userRole === 'ROLE_ADMIN' && (
          <li>
            <NavLink to="/admin/dashboard" className={({isActive}) => `${linkClass} ${isActive ? activeClass : ''}`} onClick={close}>
              Admin Dashboard
            </NavLink>
          </li>
        )}
        {userRole === 'ROLE_DOCTOR' && (
          <li>
            <NavLink to="/doctor/dashboard" className={({isActive}) => `${linkClass} ${isActive ? activeClass : ''}`} onClick={close}>
              My Dashboard
            </NavLink>
          </li>
        )}
        {userRole === 'ROLE_PATIENT' && (
          <li>
            <NavLink to="/my-appointments" className={({isActive}) => `${linkClass} ${isActive ? activeClass : ''}`} onClick={close}>
              My Appointments
            </NavLink>
          </li>
        )}
      </>
    );
  };

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
          {/* Render the new dynamic links */}
          {renderNavLinks(false)}
        </ul>

        {/* Right actions for desktop */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              {/* Display the user's actual first name */}
              <span className="greet">Hi, {firstName}</span> 
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
        {/* Render the new dynamic links for mobile */}
        <ul>
          {renderNavLinks(true)}
        </ul>
        <div className="mobile-actions">
          {isAuthenticated ? (
            <button className="btn solid full" onClick={() => { logout(); close(); }}>Logout</button>
          ) : (
            <Link to="/login" className="btn solid full" onClick={close}>Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;