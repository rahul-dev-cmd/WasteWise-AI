import { BellIcon, SearchIcon, SettingsIcon, UserIcon, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function TopNav() {
  const { user, logout } = useAuth()

  return (
    <header className="h-20 glass-panel border-x-0 border-t-0 rounded-none px-8 flex items-center justify-between z-20">
      
      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-dark-800 border border-gray-700 rounded-lg px-4 py-2 w-96 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all duration-200">
        <SearchIcon className="w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search entities, NGOs, or reports..." 
          className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder-gray-500"
        />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors relative">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </button>
        
        <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors">
          <SettingsIcon className="w-5 h-5" />
        </button>

        <div className="h-8 w-px bg-gray-700 mx-2" />

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{user?.entityName || 'Admin User'}</p>
            <p className="text-xs text-primary-400">{user?.entityType || 'Enterprise Plan'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-dark-700 border border-gray-600 flex items-center justify-center group-hover:border-primary-500 transition-colors">
            <UserIcon className="w-5 h-5 text-gray-400 group-hover:text-primary-400" />
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="ml-2 p-2 text-gray-400 hover:text-rose-400 hover:bg-dark-700 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
