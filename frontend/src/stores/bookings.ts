import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'
import apiClient from '../services/api'
import type { Property } from './properties'

export interface Booking {
  id: number
  property_id: number
  client_id: number
  start_date: string
  end_date: string
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  guests: number
  special_requests?: string
  cancellation_reason?: string
  created_at: string
  updated_at: string
  property?: Property
  client?: {
    id: number
    name: string
    email: string
    phone?: string
  }
  invoices?: Invoice[]
  // Champs additionnels pour l'interface admin
  reference?: string
  duration?: number
  client_name?: string
  client_email?: string
  client_phone?: string
  client_avatar?: string
  property_title?: string
  property_address?: string
  property_image?: string
  manager_name?: string
}

export interface Invoice {
  id: number
  booking_id: number
  invoice_number: string
  amount: number
  tax_amount: number
  total_amount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  due_date: string
  paid_at?: string
  payment_method?: string
  payment_reference?: string
  created_at: string
  updated_at: string
}

export interface BookingRequest {
  property_id: number
  start_date: string
  end_date: string
  guests: number
  total_price: number
  special_requests?: string
}

export const useBookingsStore = defineStore('bookings', () => {
  // State
  const bookings = ref<Booking[]>([])
  const managerBookings = ref<Booking[]>([])
  const allBookings = ref<Booking[]>([]) // Pour l'admin - toutes les réservations
  const currentBooking = ref<Booking | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  })

  // Getters
  const pendingBookings = computed(() => 
    bookings.value.filter(b => b.status === 'pending')
  )

  const confirmedBookings = computed(() => 
    bookings.value.filter(b => b.status === 'confirmed')
  )

  const upcomingBookings = computed(() => 
    bookings.value.filter(b => 
      b.status === 'confirmed' && new Date(b.start_date) > new Date()
    )
  )

  const pastBookings = computed(() => 
    bookings.value.filter(b => 
      b.status === 'completed' || new Date(b.end_date) < new Date()
    )
  )

  const pendingManagerBookings = computed(() => 
    managerBookings.value.filter(b => b.status === 'pending')
  )

  const myBookings = computed(() => bookings.value)

  // Getters pour l'admin
  const adminStats = computed(() => {
    const total = allBookings.value.length
    const confirmed = allBookings.value.filter(b => b.status === 'confirmed').length
    const pending = allBookings.value.filter(b => b.status === 'pending').length
    const cancelled = allBookings.value.filter(b => b.status === 'cancelled').length
    const completed = allBookings.value.filter(b => b.status === 'completed').length
    const totalRevenue = allBookings.value
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.total_price, 0)

    return { total, confirmed, pending, cancelled, completed, totalRevenue }
  })

  const statusDistribution = computed(() => {
    const distribution = allBookings.value.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(distribution).map(([name, count]) => ({
      name,
      count,
      percentage: allBookings.value.length > 0 ? Math.round((count / allBookings.value.length) * 100) : 0
    }))
  })

  // Actions
  const createBooking = async (bookingData: BookingRequest) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post('/api/bookings', bookingData)
      
      if (response.data.status === 'success') {
        bookings.value.unshift(response.data.booking)
        return { success: true, booking: response.data.booking }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la création de la réservation')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la réservation'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const fetchMyBookings = async (page = 1) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.get(`/api/my-bookings?page=${page}`)
      
      if (response.data.status === 'success') {
        bookings.value = response.data.bookings.data
        pagination.value = {
          current_page: response.data.bookings.current_page,
          last_page: response.data.bookings.last_page,
          per_page: response.data.bookings.per_page,
          total: response.data.bookings.total
        }
        return { success: true }
      } else {
        throw new Error('Erreur lors du chargement de vos réservations')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement de vos réservations'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const fetchManagerBookings = async (page = 1) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.get(`/api/manager-bookings?page=${page}`)
      
      if (response.data.status === 'success') {
        managerBookings.value = response.data.bookings.data
        pagination.value = {
          current_page: response.data.bookings.current_page,
          last_page: response.data.bookings.last_page,
          per_page: response.data.bookings.per_page,
          total: response.data.bookings.total
        }
        return { success: true }
      } else {
        throw new Error('Erreur lors du chargement des réservations')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des réservations'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Nouvelle fonction pour l'admin - récupérer toutes les réservations
  const fetchAllBookings = async (page = 1, filters: Record<string, string> = {}) => {
    try {
      isLoading.value = true
      error.value = null

      // Construire les paramètres de requête
      const params = new URLSearchParams({
        page: page.toString(),
        ...filters
      })

      const response = await apiClient.get(`/api/admin/bookings?${params}`)
      
      if (response.data.status === 'success') {
        allBookings.value = response.data.bookings.data
        pagination.value = {
          current_page: response.data.bookings.current_page,
          last_page: response.data.bookings.last_page,
          per_page: response.data.bookings.per_page,
          total: response.data.bookings.total
        }
        return { success: true }
      } else {
        throw new Error('Erreur lors du chargement des réservations')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des réservations'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const fetchBooking = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.get(`/api/bookings/${id}`)
      
      if (response.data.status === 'success') {
        currentBooking.value = response.data.booking
        return { success: true, booking: response.data.booking }
      } else {
        throw new Error('Réservation non trouvée')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement de la réservation'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const confirmBooking = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post(`/api/bookings/${id}/confirm`)
      
      if (response.data.status === 'success') {
        // Mettre à jour la réservation dans les listes
        const updateBookingInList = (list: Ref<Booking[]>) => {
          const index = list.value.findIndex((b: Booking) => b.id === id)
          if (index !== -1) {
            list.value[index] = response.data.booking
          }
        }

        updateBookingInList(bookings)
        updateBookingInList(managerBookings)

        if (currentBooking.value?.id === id) {
          currentBooking.value = response.data.booking
        }

        return { success: true, booking: response.data.booking }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la confirmation de la réservation')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la confirmation de la réservation'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const cancelBooking = async (id: number, reason: string) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post(`/api/bookings/${id}/cancel`, {
        cancellation_reason: reason
      })
      
      if (response.data.status === 'success') {
        // Mettre à jour la réservation dans les listes
        const updateBookingInList = (list: Ref<Booking[]>) => {
          const index = list.value.findIndex((b: Booking) => b.id === id)
          if (index !== -1) {
            list.value[index] = response.data.booking
          }
        }

        updateBookingInList(bookings)
        updateBookingInList(managerBookings)

        if (currentBooking.value?.id === id) {
          currentBooking.value = response.data.booking
        }

        return { success: true, booking: response.data.booking }
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'annulation de la réservation')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'annulation de la réservation'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const calculateTotalPrice = (property: Property, startDate: string, endDate: string): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return property.price_per_night * days
  }

  const clearCurrentBooking = () => {
    currentBooking.value = null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    bookings,
    managerBookings,
    allBookings,
    currentBooking,
    isLoading,
    error,
    pagination,
    // Getters
    pendingBookings,
    confirmedBookings,
    upcomingBookings,
    pastBookings,
    pendingManagerBookings,
    myBookings,
    adminStats,
    statusDistribution,
    // Actions
    createBooking,
    fetchMyBookings,
    fetchManagerBookings,
    fetchAllBookings,
    fetchBooking,
    confirmBooking,
    cancelBooking,
    calculateTotalPrice,
    clearCurrentBooking,
    clearError
  }
})
