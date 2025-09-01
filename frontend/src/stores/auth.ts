import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../services/api'
import router from '../router'

export interface User {
  id: number
  name: string
  email: string
  role: 'client' | 'manager' | 'admin'
  status: 'pending' | 'active' | 'suspended'
  phone?: string
  address?: string
  profile_picture?: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: 'client' | 'manager'
  phone?: string
  address?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')
  const userPhone = computed(() => user.value?.phone || '')
  const userAddress = computed(() => user.value?.address || '')
  const userRole = computed(() => user.value?.role || 'client')
  const isClient = computed(() => user.value?.role === 'client')
  const isManager = computed(() => user.value?.role === 'manager')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isPending = computed(() => user.value?.status === 'pending')
  const isActive = computed(() => user.value?.status === 'active')
  const isSuspended = computed(() => user.value?.status === 'suspended')

  // Actions
  const setAuthData = (userData: User, authToken: string) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
  }

  const clearAuthData = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    delete apiClient.defaults.headers.common['Authorization']
  }

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; data?: User; error?: string }> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post('/api/login', credentials)
      
      if (response.data.status === 'success') {
        setAuthData(response.data.user, response.data.access_token)
        
        // Redirection selon le rôle
        const role = response.data.user.role
        if (role === 'admin') {
          router.push('/admin/dashboard')
        } else if (role === 'manager') {
          router.push('/manager/dashboard')
        } else {
          router.push('/client/dashboard')
        }
        
        return { success: true }
      } else {
        throw new Error(response.data.message || 'Erreur de connexion')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post('/api/register', credentials)
      
      if (response.data.status === 'success') {
        setAuthData(response.data.user, response.data.access_token)
        
        // Redirection selon le rôle et le statut
        const role = response.data.user.role
        const status = response.data.user.status
        
        if (status === 'pending') {
          router.push('/pending-approval')
        } else if (role === 'admin') {
          router.push('/admin/dashboard')
        } else if (role === 'manager') {
          router.push('/manager/dashboard')
        } else {
          router.push('/client/dashboard')
        }
        
        return { success: true }
      } else {
        throw new Error(response.data.message || 'Erreur d\'inscription')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur d\'inscription'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      isLoading.value = true
      
      if (token.value) {
        await apiClient.post('/api/logout')
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
    } finally {
      clearAuthData()
      isLoading.value = false
      router.push('/login')
    }
  }

  const checkAuth = async () => {
    if (!token.value) return

    try {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      const response = await apiClient.get('/api/user')
      
      if (response.data.status === 'success' && response.data.user) {
        user.value = response.data.user
      } else {
        clearAuthData()
      }
    } catch (err) {
      console.error('Erreur de vérification d\'authentification:', err)
      clearAuthData()
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.put('/api/user', userData)
      
      if (response.data.success) {
        user.value = { ...user.value!, ...response.data.user }
        return { success: true }
      } else {
        throw new Error(response.data.message || 'Erreur de mise à jour')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de mise à jour'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    userName,
    userEmail,
    userPhone,
    userAddress,
    userRole,
    isClient,
    isManager,
    isAdmin,
    isPending,
    isActive,
    isSuspended,
    // Actions
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    clearAuthData
  }
})
