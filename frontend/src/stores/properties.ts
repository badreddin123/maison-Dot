import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../services/api'

// Interfaces pour la gestion des erreurs
interface ApiError {
  response?: {
    data?: {
      message?: string
      errors?: Record<string, string[]>
    }
  }
  message?: string
}

interface ErrorWithMessage {
  message?: string
}

export interface Property {
  id: number
  title: string
  description: string
  type: 'house' | 'apartment' | 'office'
  price_per_night: number
  address: string
  latitude?: number
  longitude?: number
  bedrooms: number
  bathrooms: number
  area?: number
  amenities?: string[]
  images?: string[]
  status: 'available' | 'occupied' | 'maintenance'
  manager_id: number
  manager?: {
    id: number
    name: string
    email: string
    phone?: string
  }
  rating?: number
  reviewsCount?: number
  featured?: boolean
  guests?: number
  created_at: string
  updated_at: string
}

export interface PropertyFilters {
  type?: string
  min_price?: number
  max_price?: number
  search?: string
  bedrooms?: number
  amenities?: string[]
}

export const usePropertiesStore = defineStore('properties', () => {
  // State
  const properties = ref<Property[]>([])
  const currentProperty = ref<Property | null>(null)
  const myProperties = ref<Property[]>([])
  const isLoading = ref(false)
  const error = ref<string | Record<string, string[]> | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0
  })

  // Getters
  const availableProperties = computed(() => 
    properties.value.filter(p => p.status === 'available')
  )

  const propertiesByType = computed(() => {
    const grouped: Record<string, Property[]> = {}
    properties.value.forEach(property => {
      if (!grouped[property.type]) {
        grouped[property.type] = []
      }
      grouped[property.type].push(property)
    })
    return grouped
  })

  // Actions
  const fetchProperties = async (page = 1, filters: PropertyFilters = {}) => {
    try {
      console.log('🔄 fetchProperties appelée avec:', { page, filters })
      isLoading.value = true
      error.value = null

      const params = new URLSearchParams({
        page: page.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
        )
      })

      const url = `/api/properties?${params}`
      console.log('🌐 URL complète:', url)
      console.log('📡 Appel API en cours...')
      
      const response = await apiClient.get(url)
      
      console.log('✅ Réponse API reçue:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      })
      
      if (response.data.status === 'success') {
        console.log('📊 Données de propriétés:', response.data.properties)
        console.log('📋 Propriétés individuelles:', response.data.properties.data)
        
        properties.value = response.data.properties.data
        pagination.value = {
          current_page: response.data.properties.current_page,
          last_page: response.data.properties.last_page,
          per_page: response.data.properties.per_page,
          total: response.data.properties.total
        }
        
        console.log('✅ Store mis à jour:', {
          propertiesCount: properties.value.length,
          pagination: pagination.value
        })
        
        return { success: true }
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

  const fetchProperty = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.get(`/api/properties/${id}`)
      
      if (response.data.status === 'success') {
        currentProperty.value = response.data.property
        return { success: true, property: response.data.property }
      } else {
        throw new Error('Propriété non trouvée')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors du chargement de la propriété'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const createProperty = async (propertyData: Partial<Property>) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post('/api/properties', propertyData)
      
      if (response.data.status === 'success') {
        myProperties.value.unshift(response.data.property)
        // Mettre à jour aussi la liste globale si elle contient cette propriété
        const globalIndex = properties.value.findIndex(p => p.id === response.data.property.id)
        if (globalIndex === -1) {
          properties.value.unshift(response.data.property)
        }
        return { success: true, property: response.data.property }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la création de la propriété')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de la création de la propriété'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const createPropertyWithFiles = async (formData: FormData) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.post('/api/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      if (response.data.status === 'success') {
        myProperties.value.unshift(response.data.property)
        // Mettre à jour aussi la liste globale si elle contient cette propriété
        const globalIndex = properties.value.findIndex(p => p.id === response.data.property.id)
        if (globalIndex === -1) {
          properties.value.unshift(response.data.property)
        }
        return { success: true, property: response.data.property }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la création de la propriété')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de la création de la propriété'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const updateProperty = async (id: number, propertyData: Partial<Property>) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.put(`/api/properties/${id}`, propertyData)
      
      if (response.data.status === 'success') {
        const index = myProperties.value.findIndex(p => p.id === id)
        if (index !== -1) {
          myProperties.value[index] = response.data.property
        }
        
        if (currentProperty.value?.id === id) {
          currentProperty.value = response.data.property
        }

        return { success: true, property: response.data.property }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la mise à jour de la propriété')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de la mise à jour de la propriété'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const updatePropertyWithFiles = async (id: number, formData: FormData) => {
    try {
      isLoading.value = true
      error.value = null

      console.log('Mise à jour de la propriété avec fichiers:', id)
      
      // Utiliser la route POST spéciale pour la mise à jour avec fichiers
      const response = await apiClient.post(`/api/properties/${id}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      if (response.data.status === 'success') {
        console.log('Propriété mise à jour avec succès:', response.data.property)
        
        const index = myProperties.value.findIndex(p => p.id === id)
        if (index !== -1) {
          myProperties.value[index] = response.data.property
        }
        
        if (currentProperty.value?.id === id) {
          currentProperty.value = response.data.property
        }

        return { success: true, property: response.data.property }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la mise à jour de la propriété')
      }
    } catch (err: unknown) {
      console.error('Erreur complète:', err)
      
      const response = (err as ApiError)?.response
      if (response?.data?.errors) {
        // Erreurs de validation détaillées
        error.value = response.data.errors
        return { success: false, error: response.data.errors }
      }
      
      const errorMessage = response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de la mise à jour de la propriété'
      error.value = errorMessage
      console.error('Erreur de mise à jour:', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const deleteProperty = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.delete(`/api/properties/${id}`)
      
      if (response.data.status === 'success') {
        myProperties.value = myProperties.value.filter(p => p.id !== id)
        properties.value = properties.value.filter(p => p.id !== id)
        
        if (currentProperty.value?.id === id) {
          currentProperty.value = null
        }

        return { success: true }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la suppression de la propriété')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors de la suppression de la propriété'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const fetchMyProperties = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiClient.get('/api/my-properties')
      
      if (response.data.status === 'success') {
        myProperties.value = response.data.properties.data
        return { success: true }
      } else {
        throw new Error('Erreur lors du chargement de vos propriétés')
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.response?.data?.message || (err as ErrorWithMessage)?.message || 'Erreur lors du chargement de vos propriétés'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const clearCurrentProperty = () => {
    currentProperty.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const setTestProperties = (testProperties: Property[]) => {
    properties.value = testProperties
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    properties,
    property: currentProperty,
    currentProperty,
    myProperties,
    isLoading,
    error,
    pagination,
    // Getters
    availableProperties,
    propertiesByType,
    // Actions
    fetchProperties,
    fetchProperty,
    createProperty,
    createPropertyWithFiles,
    updateProperty,
    updatePropertyWithFiles,
    deleteProperty,
    fetchMyProperties,
    clearCurrentProperty,
    clearError,
    setTestProperties
  }
})
