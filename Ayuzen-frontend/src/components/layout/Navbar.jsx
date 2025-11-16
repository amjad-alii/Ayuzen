import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const firstName = user?.fullName?.split(' ')[0] || 'User';
  const userRole = user?.authorities?.[0];

  // This function now renders all links based on user role
  const renderNavLinks = (isMobile = false) => {
    const linkClass = isMobile ? "drawer-link" : "nav-item";
    const activeClass = isMobile ? "active-mobile" : "active";

    return (
      <>
        {/* --- Public Links (Everyone Sees) --- */}
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
        
        {/* --- Admin-Specific Links --- */}
        {userRole === 'ROLE_ADMIN' && (
          <li>
            <NavLink to="/admin/dashboard" className={({isActive}) => `${linkClass} ${isActive ? activeClass : ''}`} onClick={close}>
              Admin Dashboard
            </NavLink>
          </li>
        )}
        
        {/* --- Doctor-Specific Links --- */}
        {userRole === 'ROLE_DOCTOR' && (
          <li>
            <NavLink to="/doctor/dashboard" className={({isActive}) => `${linkClass} ${isActive ? activeClass : ''}`} onClick={close}>
              My Dashboard
            </NavLink>
          </li>
        )}
        
        {/* --- Patient-Specific Links --- */}
        {userRole === 'ROLE_PATIENT' && (
          <>
            <li>
              <NavLink to="/my-appointments" className={({isActive}) => `${linkClass} ${isActive ? activeClass : ''}`} onClick={close}>
                My Appointments
              </NavLink>
            </li>
            {/* ADDED THIS LINK */}
            <li>
              <NavLink to="/my-records" className={({isActive}) => `${linkClass} ${isActive ? activeClass : ''}`} onClick={close}>
                My Records
              </NavLink>
            </li>
            {/* ADDED THIS LINK */}
            <li>
              <NavLink to="/my-family" className={({isActive}) => `${linkClass} ${isActive ? activeClass : ''}`} onClick={close}>
                My Family
              </NavLink>
            </li>
          </>
        )}
      </>
    );
  };

  return (
    <header className="site-header">
      <nav className="navbar" role="navigation" aria-label="Main">
        <Link to="/" className="brand" onClick={close} aria-label="Ayuzen Home">
          <span className="brand-mark">A</span>
          <span className="brand-name">Ayuzen</span>
        </Link>

        <ul className="nav-center">
          {renderNavLinks(false)}
        </ul>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="greet">Hi, {firstName}</span> 
              <button className="btn outline" onClick={logout} aria-label="Logout">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn solid" onClick={close}>Login</Link>
          )}
        </div>

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

      <div className={`mobile-drawer ${open ? 'show' : ''}`}>
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