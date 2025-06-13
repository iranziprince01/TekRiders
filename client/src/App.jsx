import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import LearnerDashboard from './pages/StudentDashboard'
import TutorDashboard from './pages/InstructorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './styles/main.scss'
import { useEffect } from 'react'
import RoleSelect from './pages/RoleSelect'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Course from './pages/Course'

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (requiredRole && user.role !== requiredRole) {
      navigate('/');
    }
  }, [user, requiredRole, navigate]);

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/role-select" element={<RoleSelect />} />
      <Route path="/course/:courseId" element={<Course />} />
      <Route 
        path="/learner" 
        element={
          <ProtectedRoute requiredRole="learner">
            <LearnerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tutor" 
        element={
          <ProtectedRoute requiredRole="tutor">
            <TutorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function AppWithConditionalHeader() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdminRoute && <Header />}
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AuthProvider>
        <AppWithConditionalHeader />
      </AuthProvider>
    </Router>
  )
}

export default App
