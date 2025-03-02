import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { FileText, User, Layout } from "lucide-react";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SavedResumes from "./pages/SavedResumes";
import ResumeDetail from "./pages/ResumeDetail";
import SubscriptionSuccess from "./pages/success";
import SubscriptionFailed from "./pages/cancel";
import Admin from './pages/admin/Admin';
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllUser from './pages/admin/AllUser';
import AllResumes from './pages/admin/AllResumes';
import Traffic from './pages/admin/Traffic';
import Analysis from './pages/admin/Analysis';
import LiveChat from './components/LiveChat';
import Support from './pages/admin/Support';
// PrivateRoute component to protect authenticated routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const isAdmin = location.pathname.includes("/admin");

  return (
    <div className="min-h-screen bg-gray-50">
      {(!isDashboard&&!isAdmin) && <Navbar />}
      {(!isAdmin) &&<LiveChat/>}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/success" element={<SubscriptionSuccess />} />
        <Route path="/cancel" element={<SubscriptionFailed />} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/admin/all-user" element={<AllUser/>} />
        <Route path="/admin/all-resumes" element={<AllResumes/>} />
        <Route path="/admin/traffic" element={<Traffic/>} />
        <Route path="/admin/analysis/:id" element={<Analysis/>} />
        <Route path="/admin/support" element={<Support/>} />
        <Route
          path="/dashboard"
          element={
            // <PrivateRoute>
            <Dashboard />
            // </PrivateRoute>
          }
        />
        <Route
          path="/saved-resumes"
          element={
            // <PrivateRoute>
            <SavedResumes />
            // </PrivateRoute>
          }
        />
        <Route path="/resume-detail/:id" element={<ResumeDetail />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
