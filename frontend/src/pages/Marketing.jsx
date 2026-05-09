import { useState } from 'react'
import { simulateMarketing } from '../api'
import { TrendingUp, Megaphone, ArrowRight, Activity, Percent } from 'lucide-react'

export default function Marketing() {
  const [formData, setFormData] = useState({
    entity_name: 'Spice Grill',
    entity_type: 'Restaurant',
    capacity: 400,
    lat: 22.5726,
    lon: 88.3639,
    local_event: false,
    promo_active: false // overwritten by backend anyway, but required by schema
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSimulate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await simulateMarketing(formData)
      setResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Marketing Simulator</h1>
        <p className="text-gray-400">Run an A/B simulation on the ML model to predict the ROI of running a promotion today.</p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSimulate} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1 w-full">
            <label className="text-sm font-medium text-gray-400">Restaurant</label>
            <select 
              className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primary-500"
              value={formData.entity_name}
              onChange={e => setFormData({...formData, entity_name: e.target.value})}
            >
              <option value="Spice Grill">Spice Grill</option>
              <option value="Bistro 1">Bistro 1</option>
            </select>
          </div>
          
          <label className="flex-1 flex items-center gap-3 bg-dark-800 border border-gray-700 rounded-lg px-4 py-2.5 cursor-pointer hover:bg-dark-700 transition-colors w-full md:w-auto">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded bg-dark-900 border-gray-600 text-primary-500 focus:ring-primary-500"
              checked={formData.local_event}
              onChange={e => setFormData({...formData, local_event: e.target.checked})}
            />
            <span className="text-gray-300 text-sm">Local Event Nearby</span>
          </label>

          <button type="submit" disabled={loading} className="btn-primary py-2.5 w-full md:w-auto px-8">
            {loading ? <Activity className="w-5 h-5 animate-spin" /> : <Megaphone className="w-5 h-5" />}
            Simulate ROI
          </button>
        </form>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="glass-card bg-dark-800/80">
            <h3 className="text-gray-400 text-sm font-medium mb-4">Without Promotion</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-white">{result.without_promo}</span>
              <span className="text-sm text-gray-500 mb-1">diners</span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-dark-800 border border-gray-700 flex items-center justify-center relative z-10">
              <ArrowRight className="w-5 h-5 text-gray-500" />
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary-500 to-transparent absolute -z-10 opacity-30" />
          </div>

          <div className="glass-card bg-primary-900/10 border-primary-500/30">
            <h3 className="text-primary-400 text-sm font-medium mb-4 flex items-center gap-2">
              <Percent className="w-4 h-4" /> With Promotion
            </h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-white">{result.with_promo}</span>
              <span className="text-sm text-primary-400/70 mb-1">diners</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-primary-500/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Expected Boost:</span>
                <span className="text-lg font-bold text-accent-400">+{result.expected_boost}</span>
              </div>
            </div>
          </div>
          
          <div className={`md:col-span-3 mt-4 p-4 rounded-xl border flex items-center justify-between ${
            result.recommendation === 'Run Campaign' 
              ? 'bg-accent-500/10 border-accent-500/30 text-accent-100'
              : 'bg-dark-800 border-gray-700 text-gray-300'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${result.recommendation === 'Run Campaign' ? 'bg-accent-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="font-medium text-sm">AI Recommendation</span>
            </div>
            <span className={`font-bold text-lg ${result.recommendation === 'Run Campaign' ? 'text-accent-400' : 'text-gray-400'}`}>
              {result.recommendation}
            </span>
          </div>

        </div>
      )}
    </div>
  )
}
