import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import InstructorUpload from './pages/InstructorUpload'
import AdminReview from './pages/AdminReview'
import './styles/main.scss'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/instructor" element={<InstructorUpload />} />
        <Route path="/admin" element={<AdminReview />} />
        {/* Add more routes here as we create them */}
      </Routes>
    </Router>
  )
}

export default App
