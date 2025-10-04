import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { User, ROLE_PERMISSIONS } from '../types/user'
import { updateUser } from '../api/users'

interface AuthContextType {
  isAuthenticated: boolean
  currentUser: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  hasPermission: (
    permission: keyof typeof ROLE_PERMISSIONS.super_user
  ) => boolean
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated (session persistence)
    const savedUser = localStorage.getItem('current_user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('current_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const API_BASE_URL =
        (import.meta as any).env?.VITE_API_URL ||
        'https://backoffice-backend.vercel.app/api'
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      })

      if (response.ok) {
        const user = await response.json()
        setCurrentUser(user)
        setIsAuthenticated(true)
        localStorage.setItem('current_user', JSON.stringify(user))
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('current_user')
  }

  const hasPermission = (
    permission: keyof typeof ROLE_PERMISSIONS.super_user
  ): boolean => {
    if (!currentUser) return false

    // Map backend role names to frontend role names
    const roleMap: Record<string, keyof typeof ROLE_PERMISSIONS> = {
      super: 'super_user',
      user: 'user',
      mini: 'mini_user',
    }

    const mappedRole = roleMap[currentUser.role] || 'mini_user'
    return ROLE_PERMISSIONS[mappedRole][permission]
  }

  const updateUserProfile = async (
    updates: Partial<User>
  ): Promise<boolean> => {
    if (!currentUser) return false

    try {
      const updatedUser = await updateUser(currentUser.id, updates)
      if (updatedUser) {
        setCurrentUser(updatedUser)
        localStorage.setItem('current_user', JSON.stringify(updatedUser))
        return true
      }
      return false
    } catch (error) {
      console.error('Update user profile error:', error)
      return false
    }
  }

  const value: AuthContextType = {
    isAuthenticated,
    currentUser,
    login,
    logout,
    isLoading,
    hasPermission,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
