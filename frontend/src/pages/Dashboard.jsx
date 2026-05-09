import { useEffect, useState } from 'react'
import { BrainCircuit, Leaf, TrendingDown, Users } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getHealth } from '../api'
import { useAuth } from '../context/AuthContext'
import { useStats } from '../context/StatsContext'

const mockChartData = [
  { name: 'Mon', actual: 240, predicted: 250 },
  { name: 'Tue', actual: 300, predicted: 290 },
  { name: 'Wed', actual: 180, predicted: 195 },
  { name: 'Thu', actual: 220, predicted: 220 },
  { name: 'Fri', actual: 380, predicted: 370 },
  { name: 'Sat', actual: 420, predicted: 430 },
  { name: 'Sun', actual: 400, predicted: 390 },
]

export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState('Checking...')
  const { user } = useAuth()
  const { stats } = useStats()

  useEffect(() => {
    getHealth()
      .then((data) => setApiStatus('Online (Connected to ML Pipeline)'))
      .catch(() => setApiStatus('Offline (Backend unreachable)'))
  }, [])

  // Calculate waste reduction % (mocking a formula based on food saved)
  const calculateWasteReduction = () => {
    if (stats.totalPredictions === 0) return "0%"
    const targetFoodWasteKg = stats.totalPredictions * 15 // Assume 15kg typical waste per day without AI
    const reductionPercent = Math.min(100, Math.round((stats.foodSavedKg / targetFoodWasteKg) * 100))
    return `${reductionPercent}%`
  }

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {user ? `${user.entityName} Overview` : 'Global Overview'}
          </h1>
          <p className="text-gray-400">Welcome back. Here's your food waste intelligence for today.</p>
        </div>
        <div className="glass-card py-2 px-4 flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${apiStatus.includes('Online') ? 'bg-accent-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-sm font-medium text-gray-300">Backend: {apiStatus}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
          <StatCard 
            title="Total Predictions" 
            value={stats.totalPredictions.toString()} 
            change="Lifetime" 
            icon={BrainCircuit} 
            color="text-primary-400" 
          />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
          <StatCard 
            title="Food Saved (kg)" 
            value={stats.foodSavedKg.toFixed(1)} 
            change="Accumulated" 
            icon={Leaf} 
            color="text-accent-400" 
          />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
          <StatCard 
            title="Waste Reduction" 
            value={calculateWasteReduction()} 
            change="Estimated" 
            icon={TrendingDown} 
            color="text-rose-400" 
          />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">
          <StatCard 
            title="Meals Donated" 
            value={stats.mealsDonated.toString()} 
            change="Lifetime" 
            icon={Users} 
            color="text-blue-400" 
          />
        </div>
      </div>

      {/* Main Chart */}
      <div className="glass-card p-6 relative min-h-[400px] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both">
        <h2 className="text-xl font-bold text-white mb-6">Model Accuracy: Predicted vs Actual Footfall</h2>
        
        {/* Subtle background glow for the chart area */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        {(!stats.history || stats.history.length === 0) ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center mt-12 text-gray-500">
            <TrendingDown className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-lg font-medium text-gray-400">No prediction data available</p>
            <p className="text-sm">Run your first AI prediction to start tracking performance</p>
          </div>
        ) : (
          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.5} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 12}} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#374151', borderRadius: '0.75rem', color: '#F3F4F6', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#F3F4F6', fontWeight: 500 }}
                  labelStyle={{ color: '#9CA3AF', marginBottom: '0.25rem' }}
                />
                <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorPredicted)" />
                <Area type="monotone" dataKey="actual" name="Actual (Est.)" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon: Icon, color }) {
  return (
    <div className="glass-card group hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 relative overflow-hidden">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/10 group-hover:to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md rounded-xl" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl bg-dark-800/80 backdrop-blur-sm border border-gray-700/50 ${color} group-hover:bg-dark-700 transition-colors`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div>
          <h3 className="text-gray-400 font-medium text-sm mb-1">{title}</h3>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
            <span className="text-xs font-medium text-gray-500 mb-1 pb-0.5">{change}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
