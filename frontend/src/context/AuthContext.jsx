import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('wastewise_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData) => {
    // Request geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userWithLocation = {
            ...userData,
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }
          saveAndNavigate(userWithLocation)
        },
        (error) => {
          console.warn("Geolocation denied or failed. Using defaults.", error)
          // Fallback to Kolkata
          const userWithDefaultLocation = {
            ...userData,
            lat: 22.5726,
            lon: 88.3639
          }
          saveAndNavigate(userWithDefaultLocation)
        }
      )
    } else {
      const userWithDefaultLocation = {
        ...userData,
        lat: 22.5726,
        lon: 88.3639
      }
      saveAndNavigate(userWithDefaultLocation)
    }
  }

  const saveAndNavigate = (userData) => {
    setUser(userData)
    localStorage.setItem('wastewise_user', JSON.stringify(userData))
    navigate('/dashboard')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('wastewise_user')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
