import { useEffect, useState } from 'react'
import { getNgoNetwork } from '../api'
import { HeartHandshake, MapPin, Truck, Box } from 'lucide-react'

export default function NgoNetwork() {
  const [ngos, setNgos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNgoNetwork()
      .then(data => setNgos(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">NGO Network</h1>
        <p className="text-gray-400">Registered partners automatically alerted when surplus food is projected.</p>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-gray-500">Loading network...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.map((ngo, idx) => (
            <div key={idx} className="glass-card flex flex-col h-full group hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center border border-primary-500/30 group-hover:border-primary-500/60 transition-colors">
                  <HeartHandshake className="w-6 h-6 text-white" />
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${ngo.driver_available ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                  {ngo.driver_available && <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />}
                  {ngo.driver_available ? 'Driver Available' : 'No Driver'}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-4 line-clamp-1">{ngo.name}</h3>
              
              <div className="space-y-3 mt-auto pt-4 border-t border-gray-700/50">
                <div className="flex items-center text-sm text-gray-400 gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{ngo.distance_km} km away</span>
                </div>
                <div className="flex items-center text-sm text-gray-400 gap-3">
                  <Box className="w-4 h-4 text-gray-500" />
                  <span>Capacity: <span className="text-white font-medium">{ngo.capacity_meals} meals</span></span>
                </div>
              </div>
              
              <button className="w-full mt-6 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm font-medium transition-colors border border-gray-600 flex items-center justify-center gap-2">
                <Truck className="w-4 h-4" />
                Dispatch Manually
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
