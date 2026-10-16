import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../lib/axios'
import AuthModal from '../components/ui/AuthModal'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    title: 'Sign in to EveryTube',
    message: '',
    redirectTo: '/home'
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/users/current-user')
      setUser(data.data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const openAuthModal = useCallback(({ title, message, redirectTo } = {}) => {
    setAuthModal({
      isOpen: true,
      title: title || 'Sign in to EveryTube',
      message: message || 'Join our community to subscribe, like, comment, and upload.',
      redirectTo: redirectTo || window.location.pathname || '/home'
    })
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const login = async (credentials) => {
    const { data } = await api.post('/users/login', credentials)
    setUser(data.data.user)
    return data
  }

  const register = async (formData) => {
    const { data } = await api.post('/users/register', formData)
    return data
  }

  const logout = async () => {
    try {
      await api.post('/users/logout')
    } catch (error) {
      console.error("Server logout failed:", error)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        checkAuth,
        authModal,
        openAuthModal,
        closeAuthModal
      }}
    >
      {!loading && children}
      <AuthModal />
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
