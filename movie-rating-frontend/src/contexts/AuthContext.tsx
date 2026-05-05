import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'react-hot-toast'
import { api, LoginCredentials, RegisterData, AuthResponse } from '../services/api'

// Match the backend User entity structure
interface User {
  id: number
  username: string
  email: string
  displayName: string
  role: 'USER' | 'ADMIN'
  emailVerified: boolean
  isActive: boolean
  profilePictureUrl?: string
  bio?: string
  preferences?: string
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (emailOrUsername: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('token')
    } catch (e) {
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
          
          // Optionally validate token with backend
          // try {
          //   const currentUser = await api.getCurrentUser()
          //   setUser(currentUser)
          //   localStorage.setItem('user', JSON.stringify(currentUser))
          // } catch (error) {
          //   // Token invalid, clear storage
          //   localStorage.removeItem('token')
          //   localStorage.removeItem('user')
          //   setToken(null)
          //   setUser(null)
          // }
        } catch (error) {
          console.error('Failed to parse stored user:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (emailOrUsername: string, password: string) => {
    setIsLoading(true)
    try {
      const credentials: LoginCredentials = { emailOrUsername, password }
      const response: AuthResponse = await api.login(credentials)
      
      const { user: userData, token: authToken } = response
      
      setUser(userData)
      setToken(authToken)
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      toast.success('Logged in successfully!')
      // Navigation will be handled by the component calling login
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      // First register the user
      await api.register(userData)
      
      // Then automatically login
      const credentials: LoginCredentials = {
        emailOrUsername: userData.email,
        password: userData.password
      }
      
      const response: AuthResponse = await api.login(credentials)
      const { user: userDataFromLogin, token: authToken } = response
      
      setUser(userDataFromLogin)
      setToken(authToken)
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userDataFromLogin))
      
      toast.success('Account created successfully!')
      // Navigation will be handled by the component calling register
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully!')
    // Navigation will be handled by the component calling logout
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      toast.success('Profile updated successfully!')
    }
  }

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}