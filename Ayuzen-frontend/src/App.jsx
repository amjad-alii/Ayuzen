import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';

// --- Page Imports ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AppointmentsPage from './pages/AppointmentsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import DoctorsPage from './pages/DoctorsPage'; // Import the new DoctorsPage
import AboutPage from './pages/AboutPage';   // Import the new AboutPage
import NotFoundPage from './pages/NotFoundPage';

// --- Main Application Layout ---
// This component wraps every page with the Navbar and consistent padding.
const AppLayout = () => (
  <>
    <Navbar />
    <main style={{ padding: '2rem' }}>
      {/* The <Outlet> renders the specific page component for the current route */}
      <Outlet />
    </main>
  </>
);

// --- Main Application Component with Routing ---
function App() {
  return (
    <Router>
      <Routes>
        {/* All routes are nested inside the AppLayout to share the same look and feel */}
        <Route element={<AppLayout />}>

          {/* --- Public Routes (accessible to everyone) --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/doctor/:doctorId" element={<DoctorProfilePage />} />

          {/* --- Protected Routes (only accessible after login) --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-appointments" element={<AppointmentsPage />} />
            {/* You can add more protected routes here in the future, like /profile */}
          </Route>

          {/* --- Not Found Route (catches any URL that doesn't match) --- */}
          <Route path="*" element={<NotFoundPage />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;