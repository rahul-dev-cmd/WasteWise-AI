import { useState, useEffect } from 'react'
import { predictFootfall } from '../api'
import { Activity, Brain, Calculator, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useStats } from '../context/StatsContext'

export default function Predictions() {
  const { user } = useAuth()
  const { recordPrediction } = useStats()
  const [formData, setFormData] = useState({
    entity_name: user?.entityName || 'UEM Kolkata Hostel',
    entity_type: user?.entityType || 'Hostel',
    capacity: 300,
    lat: user?.lat || 22.5726,
    lon: user?.lon || 88.3639,
    promo_active: false,
    local_event: false,
  })

  // Ensure formData updates if user context changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        entity_name: user.entityName,
        entity_type: user.entityType,
        lat: user.lat || prev.lat,
        lon: user.lon || prev.lon
      }))
    }
  }, [user])

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await predictFootfall({
        ...formData,
        capacity: Number(formData.capacity),
        lat: Number(formData.lat),
        lon: Number(formData.lon)
      })
      setResult(data)
      recordPrediction(data.predicted_footfall, data.food_leftover)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Live Predictions</h1>
        <p className="text-gray-400">Run the XGBoost model to predict today's footfall and food requirements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <div className="glass-card">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-700/50 pb-4">
            <Calculator className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Parameters</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Entity Name</label>
                <input 
                  type="text"
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                  value={formData.entity_name}
                  disabled
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Entity Type</label>
                <input 
                  type="text"
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                  value={formData.entity_type}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Daily Food Capacity (Meals)</label>
              <input 
                type="number" 
                className="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                value={formData.capacity}
                onChange={e => setFormData({...formData, capacity: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Latitude (Weather)</label>
                <input 
                  type="number" step="any"
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                  value={formData.lat}
                  disabled
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Longitude</label>
                <input 
                  type="number" step="any"
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                  value={formData.lon}
                  disabled
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-600 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-900 bg-dark-800 transition-colors"
                  checked={formData.promo_active}
                  onChange={e => setFormData({...formData, promo_active: e.target.checked})}
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Active Promotion</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-600 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-900 bg-dark-800 transition-colors"
                  checked={formData.local_event}
                  onChange={e => setFormData({...formData, local_event: e.target.checked})}
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Local Event Today</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary mt-6"
            >
              {loading ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Run Prediction
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="glass-card relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-700/50 pb-4">
            <Activity className="w-5 h-5 text-accent-400" />
            <h2 className="text-xl font-semibold text-white">Model Output</h2>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm">
              Failed to reach ML backend. Make sure the server is running on port 8001.
            </div>
          )}

          {!result && !error && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-3">
              <Brain className="w-12 h-12 opacity-50" />
              <p>Awaiting parameters to run model...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-800 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-sm text-gray-400 mb-1">Predicted Footfall</p>
                  <p className="text-3xl font-bold text-white">{result.predicted_footfall}</p>
                </div>
                <div className="bg-dark-800 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-sm text-gray-400 mb-1">Projected Surplus</p>
                  <p className={`text-3xl font-bold ${result.food_leftover > 0 ? 'text-amber-400' : 'text-accent-400'}`}>
                    {result.food_leftover} <span className="text-base font-normal">meals</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400 text-sm">Live Weather Used</span>
                  <span className="text-white font-medium bg-dark-700 px-3 py-1 rounded-full text-sm">{result.weather_used}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400 text-sm">Model Confidence</span>
                  <span className={`font-medium px-3 py-1 rounded-full text-sm ${result.confidence === 'High' ? 'bg-accent-500/20 text-accent-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {result.confidence}
                  </span>
                </div>
              </div>

              {result.ngo_alert_triggered && (
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-amber-400 mb-1">NGO Alert Triggered</h4>
                      <p className="text-xs text-amber-400/80 leading-relaxed">
                        The predicted footfall ({result.predicted_footfall}) is lower than your daily capacity ({formData.capacity}). The system has automatically alerted the NGO network to schedule a pickup for the ~{result.food_leftover} surplus meals.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Decorative background glow */}
          {result && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          )}
        </div>

      </div>
    </div>
  )
}
