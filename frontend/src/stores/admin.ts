import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../services/api'
import type { User } from './auth'
import type { Property } from './properties'

// Interfaces pour la gestion des erreurs
interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

interface ErrorWithMessage {
  message?: string
}

// Interfaces pour les données utilisateur
interface CreateUserData {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: 'client' | 'manager' | 'admin'
  phone?: string
}

interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
  status?: 'active' | 'suspended'
  role?: 'client' | 'manager' | 'admin'
}

export interface AdminStats {
  total_users: number
  total_clients: number
  total_managers: number
  pending_managers: number
  total_properties: number
  available_properties: number
  occupied_properties: number
  total_bookings: number
  pending_bookings: number
  confirmed_bookings: number
  total_revenue: number
  pending_payments: number
}

export interface MonthlyStats {
  bookings: Array<{ month: number; count: number }>
  revenue: Array<{ month: number; total: number }>
}

export interface PropertyWithStats extends Property {
  manager_name?: string
  manager_email?: string
  bookings_count?: number
  total_revenue?: number
  rating?: number
  reviews_count?: number
}

export interface TypeDistribution {
  type: string
  count: number
  percentage: number
}

export interface ManagerPerformance {
  id: number
  name: string
  email: string
  properties_count: number
  total_revenue: number
  average_rating: number
  bookings_count: number
}

export interface AdminPropertiesData {
  properties: PropertyWithStats[]
  stats: {
    total: number
    available: number
    occupied: number
    maintenance: number
    total_revenue: number
  }
  type_distribution: TypeDistribution[]
  revenue_by_month: Array<{ month: string; value: number }>
  top_managers: ManagerPerformance[]
}

export interface AdminReport {
  period: {
    start_date: string
    end_date: string
  }
  users: {
    new_registrations: number
    new_clients: number
    new_managers: number
  }
  properties: {
    new_properties: number
    by_type: Array<{ type: string; count: number }>
  }
  bookings: {
    total_bookings: number
    confirmed_bookings: number
    cancelled_bookings: number
  }
  revenue: {
    total_revenue: number
    pending_revenue: number
  }
}

export const useAdminStore = defineStore('admin', () => {
  // State
  const stats = ref<AdminStats | null>(null)
  const monthlyStats = ref<MonthlyStats | null>(null)
  const users = ref<User[]>([])
  const pendingManagers = ref<User[]>([])
  const report = ref<AdminReport | null>(null)
  const propertiesData = ref<AdminPropertiesData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  })

  // Getters
  const activeUsers = computed(() => 
    users.value.filter(u => u.status === 'active')
  )

  const suspendedUsers = computed(() => 
    users.value.filter(u => u.status === 'suspended')
  )

  const clientUsers = computed(() => 
    users.value.filter(u => u.role === 'client')
  )

  const managerUsers = computed(() => 
    users.value.filter(u => u.role === 'manager')
  )

  // Actions
  const fetchDashboard = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.get('/api/admin/dashboard')
      
      if (response.data.status === 'success') {
        stats.value = response.data.stats
        monthlyStats.value = response.data.monthly_stats
        return { success: true }
      } else {
        throw new Error('Erreur lors du chargement du dashboard')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors du chargement du dashboard'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const fetchUsers = async (page = 1, filters: { role?: string; status?: string; search?: string } = {}) => {
    try {
      isLoading.value = true
      error.value = null

      const params = new URLSearchParams({
        page: page.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
        )
      })

      const response = await apiClient.get(`/api/admin/users?${params}`)
      
      if (response.data.status === 'success') {
        users.value = response.data.users.data
        pagination.value = {
          current_page: response.data.users.current_page,
          last_page: response.data.users.last_page,
          per_page: response.data.users.per_page,
          total: response.data.users.total
        }
        return { success: true }
      } else {
        throw new Error('Erreur lors du chargement des utilisateurs')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors du chargement des utilisateurs'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const fetchPendingManagers = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.get('/api/admin/pending-managers')
      
      if (response.data.status === 'success') {
        pendingManagers.value = response.data.managers
        return { success: true }
      } else {
        throw new Error('Erreur lors du chargement des managers en attente')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors du chargement des managers en attente'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const approveManager = async (userId: number) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post(`/api/admin/users/${userId}/approve-manager`)
      
      if (response.data.status === 'success') {
        // Retirer de la liste des managers en attente
        pendingManagers.value = pendingManagers.value.filter(m => m.id !== userId)
        
        // Mettre à jour dans la liste des utilisateurs si elle existe
        const userIndex = users.value.findIndex(u => u.id === userId)
        if (userIndex !== -1) {
          users.value[userIndex] = response.data.user
        }

        return { success: true, user: response.data.user }
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'approbation du manager')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de l\'approbation du manager'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const suspendUser = async (userId: number) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post(`/api/admin/users/${userId}/suspend`)
      
      if (response.data.status === 'success') {
        // Mettre à jour dans la liste des utilisateurs
        const userIndex = users.value.findIndex(u => u.id === userId)
        if (userIndex !== -1) {
          users.value[userIndex] = response.data.user
        }

        return { success: true, user: response.data.user }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la suspension de l\'utilisateur')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de la suspension de l\'utilisateur'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const activateUser = async (userId: number) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post(`/api/admin/users/${userId}/activate`)
      
      if (response.data.status === 'success') {
        // Mettre à jour dans la liste des utilisateurs
        const userIndex = users.value.findIndex(u => u.id === userId)
        if (userIndex !== -1) {
          users.value[userIndex] = response.data.user
        }

        return { success: true, user: response.data.user }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la réactivation de l\'utilisateur')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de la réactivation de l\'utilisateur'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const deleteUser = async (userId: number) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.delete(`/api/admin/users/${userId}`)
      
      if (response.data.status === 'success') {
        // Retirer de toutes les listes
        users.value = users.value.filter(u => u.id !== userId)
        pendingManagers.value = pendingManagers.value.filter(m => m.id !== userId)

        return { success: true }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la suppression de l\'utilisateur')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de la suppression de l\'utilisateur'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const createAdmin = async (adminData: { name: string; email: string; password: string; password_confirmation: string }) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post('/api/admin/create-admin', adminData)
      
      if (response.data.status === 'success') {
        return { success: true, admin: response.data.admin }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la création de l\'administrateur')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de la création de l\'administrateur'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const generateReport = async (startDate: string, endDate: string) => {
    try {
      isLoading.value = true
      error.value = null

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate
      })

      const response = await apiClient.get(`/api/admin/report?${params}`)
      
      if (response.data.status === 'success') {
        report.value = response.data.report
        return { success: true, report: response.data.report }
      } else {
        throw new Error('Erreur lors de la génération du rapport')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de la génération du rapport'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const fetchPropertiesData = async (filters: { 
    search?: string; 
    type?: string; 
    status?: string; 
    city?: string 
  } = {}) => {
    try {
      isLoading.value = true
      error.value = null

      const params = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
        )
      )

      const response = await apiClient.get(`/api/admin/properties?${params}`)
      
      if (response.data.status === 'success') {
        propertiesData.value = response.data.data
        return { success: true, data: response.data.data }
      } else {
        throw new Error('Erreur lors du chargement des propriétés')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors du chargement des propriétés'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const clearReport = () => {
    report.value = null
  }

  const clearPropertiesData = () => {
    propertiesData.value = null
  }

  const createUser = async (userData: CreateUserData) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post('/api/admin/users', userData)
      
      if (response.data.status === 'success') {
        // Ajouter le nouvel utilisateur à la liste
        users.value.unshift(response.data.user)
        return { success: true, user: response.data.user }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la création de l\'utilisateur')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de la création de l\'utilisateur'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const updateUser = async (userId: number, userData: UpdateUserData) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.put(`/api/admin/users/${userId}`, userData)
      
      if (response.data.status === 'success') {
        // Mettre à jour dans la liste des utilisateurs
        const userIndex = users.value.findIndex(u => u.id === userId)
        if (userIndex !== -1) {
          users.value[userIndex] = response.data.user
        }
        return { success: true, user: response.data.user }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la mise à jour de l\'utilisateur')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de la mise à jour de l\'utilisateur'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const bulkAction = async (action: string, userIds: number[]) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post('/api/admin/users/bulk', {
        action,
        user_ids: userIds
      })
      
      if (response.data.status === 'success') {
        // Mettre à jour ou supprimer les utilisateurs selon l'action
        if (action === 'delete') {
          users.value = users.value.filter(u => !userIds.includes(u.id))
        } else {
          // Pour suspend/activate, mettre à jour le statut
          userIds.forEach(userId => {
            const userIndex = users.value.findIndex(u => u.id === userId)
            if (userIndex !== -1) {
              users.value[userIndex].status = action === 'suspend' ? 'suspended' : 'active'
            }
          })
        }
        return { success: true }
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'action en lot')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de l\'action en lot'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const getUserStats = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.get('/api/admin/users/stats')
      
      if (response.data.status === 'success') {
        return { success: true, stats: response.data.stats }
      } else {
        throw new Error('Erreur lors du chargement des statistiques')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors du chargement des statistiques'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    stats,
    monthlyStats,
    users,
    pendingManagers,
    report,
    propertiesData,
    isLoading,
    error,
    pagination,
    // Getters
    activeUsers,
    suspendedUsers,
    clientUsers,
    managerUsers,
    // Actions
    fetchDashboard,
    fetchUsers,
    fetchPendingManagers,
    fetchPropertiesData,
    approveManager,
    suspendUser,
    activateUser,
    deleteUser,
    createUser,
    updateUser,
    bulkAction,
    getUserStats,
    createAdmin,
    generateReport,
    clearError,
    clearReport,
    clearPropertiesData
  }
})
