import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function Surplus() {
  const surpluses = [
    { id: 1, entity: 'Spice Grill', amount: 45, status: 'NGO Dispatched', time: '10 mins ago', severity: 'medium' },
    { id: 2, entity: 'Hostel B', amount: 120, status: 'Pending Pickup', time: '1 hour ago', severity: 'high' },
    { id: 3, entity: 'UEM Kolkata Hostel', amount: 12, status: 'Completed', time: 'Yesterday', severity: 'low' },
    { id: 4, entity: 'Bistro 1', amount: 30, status: 'Completed', time: 'Yesterday', severity: 'low' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Surplus & Waste Alerts</h1>
        <p className="text-gray-400">Track automatically triggered surplus events and their resolution status.</p>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl font-semibold text-white">Recent Alerts</h2>
          </div>
          <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">View History</button>
        </div>
        
        <div className="divide-y divide-gray-700/50">
          {surpluses.map((item) => (
            <div key={item.id} className="p-6 flex items-center justify-between hover:bg-dark-700/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  item.severity === 'high' ? 'bg-rose-500/20 text-rose-400' :
                  item.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-dark-700 text-gray-400'
                }`}>
                  {item.severity === 'high' ? <AlertTriangle className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{item.entity}</h3>
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    {item.time}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{item.amount} <span className="text-sm font-normal text-gray-400">meals</span></p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  {item.status === 'Completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                  <span className={`text-xs font-medium ${item.status === 'Completed' ? 'text-accent-500' : 'text-amber-500'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
