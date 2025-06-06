import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import StudentDashboard from './pages/StudentDashboard'
import InstructorDashboard from './pages/InstructorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import './styles/main.scss'

// Mock user for demonstration; replace with real auth logic
const user = JSON.parse(localStorage.getItem('user')) || null;

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/student" element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
        <Route path="/instructor" element={user?.role === 'instructor' ? <InstructorDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
