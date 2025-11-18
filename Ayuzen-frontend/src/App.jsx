import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Import useAuth

// --- Layout & Route Guards ---
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import DoctorRoute from "./components/auth/DoctorRoute";

// --- Page Imports ---
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import DoctorProfilePage from "./pages/DoctorProfilePage";
import DoctorsPage from "./pages/DoctorsPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import MyDocumentsPage from './pages/MyDocumentsPage';

// --- Admin Page Imports ---
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageDoctorsPage from "./pages/admin/ManageDoctorsPage";
import ClinicAppointmentsPage from "./pages/admin/ClinicAppointmentsPage";
import ClinicCalendarPage from "./pages/admin/ClinicCalendarPage";
import ManagePatientsPage from "./pages/admin/ManagePatientsPage";
import PatientHistoryPage from "./pages/admin/PatientHistoryPage";
import ClinicSettingsPage from "./pages/admin/ClinicSettingsPage";

// --- Doctor Page Imports ---
import DoctorPatientHistoryPage from "./pages/doctor/DoctorPatientHistoryPage";
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import DoctorSchedulePage from './pages/doctor/DoctorSchedulePage' ;
import ConsultationPage from "./pages/doctor/ConsultationPage";

import FamilyMembersPage from './pages/FamilyMembersPage';
import MyHealthIdPage from './pages/MyHealthIdPage';

// --- CHATBOT IMPORT ---
import Chatbot from "./components/chatbot/Chatbot";


// --- Main Public Application Layout ---
const AppLayout = () => (
  <>
    <Navbar />
    <main style={{ padding: "2rem" }}>
      <Outlet />
    </main>
    <Chatbot />
  </>
);

// --- Main Application Component with All Routes ---
function App() {
  const { isLoading } = useAuth(); // Get the loading state from the context

  // If the app is still checking for an existing token, show a loading screen.
  // This prevents the router from rendering and causing a premature redirect.
  if (isLoading) {
    return <div>Loading Application...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public & User-Facing Routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/doctor/:doctorId" element={<DoctorProfilePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/my-appointments" element={<AppointmentsPage />} />
          </Route>
          <Route path="/my-records" element={<MyDocumentsPage />} />
          <Route path="/my-family" element={<FamilyMembersPage />} />
          <Route path="/my-health-id" element={<MyHealthIdPage />} />
        </Route>

        {/* Secure Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/doctors" element={<ManageDoctorsPage />} />
            <Route
              path="/admin/appointments"
              element={<ClinicAppointmentsPage />}
            />
            <Route path="/admin/calendar" element={<ClinicCalendarPage />} />
            <Route path="/admin/patients" element={<ManagePatientsPage />} />
            <Route
              path="/admin/patients/:patientId"
              element={<PatientHistoryPage />}
            />
            <Route path="/admin/settings" element={<ClinicSettingsPage />} />
          </Route>
        </Route>

        {/* Secure Doctor Routes */}
        <Route element={<DoctorRoute />}>
          {/* 3. Add the doctor dashboard route */}
          <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
          <Route path="/doctor/patients/:patientId/history" element={<DoctorPatientHistoryPage />} />
          <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
          <Route path="/doctor/consultation/:appointmentId/patient/:patientId" element={<ConsultationPage />} />
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
