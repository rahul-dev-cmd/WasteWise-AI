import { useState } from 'react'
import { Leaf, Heart, BarChart3, Store, Building2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { GoogleLogin } from '@react-oauth/google'

export default function Login() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    entityName: '',
    entityType: 'Restaurant'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.entityName) return

    // Simulate login by passing the entity info
    login(formData)
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">

      {/* LEFT PANEL - Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0B132B] flex-col justify-between p-12 relative overflow-hidden">
        {/* Top Branding */}
        <div className="z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">WasteWise</h2>
            <p className="text-[10px] text-gray-400">Optimize. Reduce. Feed.</p>
          </div>
        </div>

        {/* Content */}
        <div className="z-10 mt-16 max-w-md">
          <h1 className="text-5xl font-bold text-white leading-tight mb-2">
            Less Waste.<br />
            <span className="text-primary-500">More Impact.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            Optimize food surplus and connect with NGOs to nourish communities and build a sustainable future.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-gray-700 bg-dark-800/50 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Reduce Food Waste</h3>
                <p className="text-sm text-gray-400">Track, optimize and reduce food surplus.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-gray-700 bg-dark-800/50 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Donate with Purpose</h3>
                <p className="text-sm text-gray-400">Connect with verified NGOs and help those in need.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-gray-700 bg-dark-800/50 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Drive Real Impact</h3>
                <p className="text-sm text-gray-400">Measure your impact and contribute to a better tomorrow.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="z-10 mt-auto pt-12 flex items-center gap-3 text-sm text-gray-400 border-t border-gray-800 inline-block w-max">
          <CheckCircle2 className="w-5 h-5 text-primary-500" />
          <span>Trusted by 500+ Businesses</span>
          <span className="w-1 h-1 rounded-full bg-gray-600 mx-1"></span>
          <span>100+ NGOs</span>
          <span className="w-1 h-1 rounded-full bg-gray-600 mx-1"></span>
          <span>Countless Lives Impacted</span>
        </div>

        {/* Generated Van Illustration */}
        <img
          src="/van.png"
          alt="Food Rescue Van"
          className="absolute right-[-15%] bottom-[10%] w-[110%] max-w-[800px] object-contain opacity-90 mix-blend-screen mix-blend-lighten pointer-events-none"
          style={{ maskImage: 'linear-gradient(to left, black, transparent)' }}
        />
        {/* Fallback glow if image mask doesn't work perfectly */}
        <div className="absolute right-0 bottom-0 w-[80%] h-[80%] bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
      </div>

      {/* RIGHT PANEL - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white overflow-y-auto">
        <div className="absolute top-8 right-8 text-sm text-gray-500 flex items-center gap-4">
          <span>New to WasteWise?</span>
          <button className="px-4 py-2 border border-primary-500 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors">
            Sign Up
          </button>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              Welcome Back <Leaf className="w-6 h-6 text-primary-500" />
            </h1>
            <p className="text-gray-500 mt-2">Log in to continue optimizing and making an impact.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Business Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white"
                  placeholder="Enter your business name (e.g. UEM Kolkata Hostel)"
                  value={formData.entityName}
                  onChange={e => setFormData({ ...formData, entityName: e.target.value })}
                />
              </div>
            </div>

            {/* I am a (Type selector) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">I am a</label>
              <div className="grid grid-cols-1 gap-3 relative">

                {/* Simulated Custom Select (Simplified as a styled dropdown using standard elements for reliability) */}
                <select
                  className="block w-full pl-10 pr-3 py-3 border border-primary-300 rounded-t-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors appearance-none bg-white font-medium"
                  value={formData.entityType}
                  onChange={e => setFormData({ ...formData, entityType: e.target.value })}
                >
                  <option value="Restaurant">Restaurant (Manage food waste from your restaurant)</option>
                  <option value="Hostel">Hostel (Manage food waste from your hostel)</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.entityType === 'Restaurant' ? <Store className="h-5 w-5 text-gray-500" /> : <Building2 className="h-5 w-5 text-gray-500" />}
                </div>
              </div>

              {/* Fake dropdown items to match design */}
              <div className="border border-gray-200 border-t-0 rounded-b-lg overflow-hidden bg-white shadow-sm opacity-50 pointer-events-none hidden">
                {/* Hiding this block to keep the component simple but maintain the form's structural aesthetic if needed later */}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Log In <span className="ml-2">→</span>
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div className="mt-8">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse)

                login({
                  entityName: 'Google User',
                  entityType: 'Restaurant'
                })
              }}
              onError={() => {
                console.log('Login Failed')
              }}
            />
          </div>

          <p className="mt-8 text-center text-xs text-gray-500">
            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            By logging in, you agree to our <a href="#" className="text-primary-600 hover:text-primary-500">Terms of Service</a> and <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
