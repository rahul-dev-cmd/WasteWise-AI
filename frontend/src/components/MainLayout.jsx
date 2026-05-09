import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

export default function MainLayout() {
  const { user } = useAuth()

  // Protect all routes inside MainLayout
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-dark-900 w-full">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopNav />
        
        {/* Page Content with scroll */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
