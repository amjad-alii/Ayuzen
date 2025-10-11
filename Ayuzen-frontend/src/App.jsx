import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

// --- Layout & Route Guards ---
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

// --- Page Imports ---
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import DoctorProfilePage from "./pages/DoctorProfilePage";
import DoctorsPage from "./pages/DoctorsPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

// --- Admin Page Imports ---
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageDoctorsPage from './pages/admin/ManageDoctorsPage';
// Add imports for other admin pages as you create them
// import ManageDoctorsPage from './pages/admin/ManageDoctorsPage';

// --- Main Public Application Layout ---
// This component wraps every public page with the main Navbar.
const AppLayout = () => (
  <>
    <Navbar />
    <main style={{ padding: "2rem" }}>
      <Outlet />
    </main>
  </>
);

// --- Main Application Component with All Routes ---
function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public & User-Facing Routes --- */}
        {/* These routes use the main AppLayout with the top Navbar */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/doctor/:doctorId" element={<DoctorProfilePage />} />

          {/* Protected routes for regular users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-appointments" element={<AppointmentsPage />} />
          </Route>
        </Route>

        {/* --- Secure Admin Routes --- */}
        {/* These routes are first guarded by AdminRoute, then use the AdminLayout with the sidebar */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/doctors" element={<ManageDoctorsPage />} />{" "}
            {/* ADD THIS ROUTE */}
          </Route>
        </Route>

        {/* --- Not Found Route (Catches all other URLs) --- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
