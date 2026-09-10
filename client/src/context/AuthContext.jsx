import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('userData')
    const storedToken = localStorage.getItem('fakeToken')
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.error('Failed to parse stored user:', err)
        localStorage.removeItem('userData')
        localStorage.removeItem('fakeToken')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('userData', JSON.stringify(userData))
    localStorage.setItem('fakeToken', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('userData')
    localStorage.removeItem('fakeToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}