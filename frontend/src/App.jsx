import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { StatsProvider } from './context/StatsContext'
import MainLayout from './components/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Predictions from './pages/Predictions'
import Surplus from './pages/Surplus'
import NgoNetwork from './pages/NgoNetwork'
import Marketing from './pages/Marketing'

function App() {
  return (
    <AuthProvider>
      <StatsProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes wrapped in Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/surplus" element={<Surplus />} />
            <Route path="/ngo-network" element={<NgoNetwork />} />
            <Route path="/marketing" element={<Marketing />} />
          </Route>
        </Routes>
      </StatsProvider>
    </AuthProvider>
  )
}

export default App
