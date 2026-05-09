import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const StatsContext = createContext()

export function StatsProvider({ children }) {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalPredictions: 0,
    foodSavedKg: 0,
    mealsDonated: 0,
    history: []
  })

  // Ensure storage is scoped to the specific business
  const getStorageKey = () => {
    return user?.entityName ? `wastewise_stats_${user.entityName.replace(/\s+/g, '_')}` : 'wastewise_stats_guest'
  }

  // Load from localStorage on mount or when user changes
  useEffect(() => {
    if (!user) {
      // If logged out, reset stats
      setStats({
        totalPredictions: 0,
        foodSavedKg: 0,
        mealsDonated: 0,
        history: []
      })
      return
    }

    const savedStats = localStorage.getItem(getStorageKey())
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    } else {
      // Reset if no stats exist for this newly logged-in user
      setStats({
        totalPredictions: 0,
        foodSavedKg: 0,
        mealsDonated: 0,
        history: []
      })
    }
  }, [user])

  // Function to record a new prediction result
  const recordPrediction = (predictedFootfall, foodLeftoverMeals) => {
    if (!user) return

    setStats(prevStats => {
      // Assuming 1 meal is roughly 0.4 kg of food saved
      const newFoodSavedKg = foodLeftoverMeals > 0 ? (foodLeftoverMeals * 0.4) : 0
      const newMealsDonated = foodLeftoverMeals > 0 ? foodLeftoverMeals : 0

      const now = new Date()
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const historyEntry = {
        name: timeStr,
        predicted: predictedFootfall,
        actual: predictedFootfall + Math.floor(Math.random() * 20 - 10) // Simulate actual for the chart
      }

      const newHistory = [...(prevStats.history || []), historyEntry].slice(-20) // Keep last 20

      const updatedStats = {
        totalPredictions: prevStats.totalPredictions + 1,
        foodSavedKg: prevStats.foodSavedKg + newFoodSavedKg,
        mealsDonated: prevStats.mealsDonated + newMealsDonated,
        history: newHistory
      }

      // Save to localStorage
      localStorage.setItem(getStorageKey(), JSON.stringify(updatedStats))
      
      return updatedStats
    })
  }

  return (
    <StatsContext.Provider value={{ stats, recordPrediction }}>
      {children}
    </StatsContext.Provider>
  )
}

export const useStats = () => useContext(StatsContext)
