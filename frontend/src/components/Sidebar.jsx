import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BrainCircuit, HeartHandshake, TrendingUp, ShieldAlert } from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/predictions', label: 'AI Predictions', icon: BrainCircuit },
  { path: '/surplus', label: 'Surplus Alerts', icon: ShieldAlert },
  { path: '/ngo-network', label: 'NGO Network', icon: HeartHandshake },
  { path: '/marketing', label: 'Marketing ROI', icon: TrendingUp },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="w-64 glass-panel border-y-0 border-l-0 rounded-none flex flex-col h-full z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
          W
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          WasteWise AI
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'nav-item-active' 
                  : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mx-4 mb-6 bg-gradient-to-br from-dark-800 to-dark-700 rounded-xl border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">System Live</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          XGBoost model is active and monitoring realtime footfall parameters.
        </p>
      </div>
    </div>
  )
}
