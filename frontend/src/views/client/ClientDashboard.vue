<template>
  <div class="client-dashboard">
    <!-- En-tête principal -->
    <div class="dashboard-header ultra-modern-card">
      <div class="header-content">
        <div class="welcome-section">
          <h1 class="welcome-title client-welcome-title">
            Bienvenue, {{ authStore.userName }} !
          </h1>
          <p class="welcome-subtitle">
            Découvrez et réservez les meilleures propriétés pour vos besoins
          </p>
        </div>
        
        <div class="header-actions">
          <router-link to="/client/properties" class="action-btn primary ultra-modern-btn ultra-modern-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Explorer les propriétés
          </router-link>
          
          <router-link to="/client/bookings" class="action-btn secondary ultra-modern-btn ultra-modern-btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Mes réservations
          </router-link>
        </div>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card ultra-modern-card ultra-modern-animate-fade-scale" :style="{ animationDelay: '0s' }">
          <div class="stat-icon ultra-modern-gradient-bg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number ultra-modern-text-primary">{{ totalBookings }}</div>
            <div class="stat-label ultra-modern-text-secondary">Réservations totales</div>
          </div>
        </div>

        <div class="stat-card ultra-modern-card ultra-modern-animate-fade-scale" :style="{ animationDelay: '0.1s' }">
          <div class="stat-icon pending ultra-modern-warning-bg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number ultra-modern-text-primary">{{ pendingBookings.length }}</div>
            <div class="stat-label ultra-modern-text-secondary">En attente</div>
          </div>
        </div>

        <div class="stat-card ultra-modern-card ultra-modern-animate-fade-scale" :style="{ animationDelay: '0.2s' }">
          <div class="stat-icon confirmed ultra-modern-success-bg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number ultra-modern-text-primary">{{ confirmedBookings.length }}</div>
            <div class="stat-label ultra-modern-text-secondary">Confirmées</div>
          </div>
        </div>

        <div class="stat-card ultra-modern-card ultra-modern-animate-fade-scale" :style="{ animationDelay: '0.3s' }">
          <div class="stat-icon upcoming ultra-modern-info-bg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number ultra-modern-text-primary">{{ upcomingBookings.length }}</div>
            <div class="stat-label ultra-modern-text-secondary">À venir</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="dashboard-content">
      <!-- Réservations récentes -->
      <div class="content-section ultra-modern-card">
        <div class="section-header">
          <h2 class="section-title ultra-modern-text-gradient">Réservations récentes</h2>
          <router-link to="/client/bookings" class="see-all-link">
            Voir tout
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
        
        <div v-if="bookingsStore.isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Chargement de vos réservations...</p>
        </div>
        
        <div v-else-if="recentBookings.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3>Aucune réservation</h3>
          <p>Vous n'avez pas encore effectué de réservation.</p>
          <router-link to="/client/properties" class="cta-btn">
            Explorer les propriétés
          </router-link>
        </div>
        
        <div v-else class="bookings-list">
          <div 
            v-for="(booking, index) in recentBookings" 
            :key="booking.id" 
            class="booking-card ultra-modern-card ultra-modern-animate-fade-scale"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="booking-image">
              <img 
                :src="getPropertyImageSrc(booking.property)" 
                :alt="booking.property?.title"
                @error="(e) => handleImageError(e, booking.property?.type)"
              />
              <div class="booking-status" :class="booking.status">
                {{ getStatusLabel(booking.status) }}
              </div>
              <div class="property-type-icon">
                <svg v-if="booking.property?.type === 'house'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
                <svg v-else-if="booking.property?.type === 'apartment'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/>
                  <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>
                </svg>
                <svg v-else-if="booking.property?.type === 'office'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 21h18M3 7v1a3 3 0 003 3h12a3 3 0 003-3V7"/>
                  <path d="M3 7l6-3 6 3 6-3v11"/>
                  <path d="M8 12v.01M12 12v.01M16 12v.01"/>
                </svg>
              </div>
            </div>
            
            <div class="booking-content">
              <h3 class="booking-title">{{ booking.property?.title }}</h3>
              <p class="booking-address">{{ booking.property?.address }}</p>
              
              <div class="booking-details">
                <div class="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>{{ formatDateRange(booking.start_date, booking.end_date) }}</span>
                </div>
                
                <div class="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121L17 20zM9 6a3 3 0 106 0v1H9V6z"/>
                  </svg>
                  <span>{{ booking.guests }} invité{{ booking.guests > 1 ? 's' : '' }}</span>
                </div>
              </div>
              
              <div class="booking-price">
                {{ formatPrice(booking.total_price) }}
              </div>
            </div>
            
            <div class="booking-actions">
              <button 
                @click="openBookingDetails(booking)" 
                class="details-btn ultra-modern-btn ultra-modern-btn-primary"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Voir détails
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Propriétés recommandées -->
      <div class="content-section ultra-modern-card">
        <div class="section-header">
          <h2 class="section-title ultra-modern-text-gradient">Propriétés recommandées</h2>
          <div style="display: flex; gap: 1rem; align-items: center;">
            <button 
              v-if="isDevelopment"
              @click="debugReloadProperties"
              style="padding: 0.5rem 1rem; background: orange; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              🔄 Debug Reload
            </button>
            <button 
              v-if="isDevelopment"
              @click="testApiDirect"
              style="padding: 0.5rem 1rem; background: blue; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              🧪 Test API
            </button>
            <router-link to="/client/properties" class="see-all-link">
              Voir tout
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </router-link>
          </div>
        </div>
        
        <div v-if="propertiesStore.isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Chargement des propriétés...</p>
          <p v-if="isDevelopment" style="font-size: 0.8rem; color: #666;">
            Debug: isLoading={{ propertiesStore.isLoading }}, 
            total={{ propertiesStore.properties.length }}, 
            available={{ propertiesStore.availableProperties.length }},
            error={{ propertiesStore.error }}
          </p>
        </div>
        
        <div v-else-if="recommendedProperties.length === 0" class="empty-state">
          <p>Aucune propriété disponible</p>
          <p v-if="isDevelopment" style="font-size: 0.8rem; color: #666;">
            Debug: total={{ propertiesStore.properties.length }}, 
            available={{ propertiesStore.availableProperties.length }}
          </p>
        </div>
        
        <div v-else class="properties-grid">
          <div 
            v-for="(property, index) in recommendedProperties" 
            :key="property.id" 
            class="property-card ultra-modern-card ultra-modern-animate-fade-scale"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="property-image">
              <img 
                :src="getPropertyImageSrc(property) || '/placeholder-property.svg'" 
                :alt="property.title"
                @error="(e) => handleImageError(e, property?.type)"
              />
              <div class="property-type">{{ getTypeLabel(property.type) }}</div>
            </div>
            
            <div class="property-content">
              <h3 class="property-title">{{ property.title }}</h3>
              <p class="property-address">{{ property.address }}</p>
              
              <div class="property-features">
                <span class="feature">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7"/>
                  </svg>
                  {{ property.bedrooms }} ch.
                </span>
                <span class="feature">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3a2 2 0 002 2h4a2 2 0 002-2v-3"/>
                  </svg>
                  {{ property.bathrooms }} sdb
                </span>
                <span v-if="property.area" class="feature">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2M16 4h2a2 2 0 012 2v2M16 20h2a2 2 0 002-2v-2"/>
                  </svg>
                  {{ property.area }} m²
                </span>
              </div>
              
              <div class="property-price">
                {{ formatPrice(property.price_per_night) }}/nuit
              </div>
            </div>
            
            <div class="property-actions">
              <router-link 
                :to="`/client/properties/${property.id}`" 
                class="view-btn ultra-modern-btn ultra-modern-btn-primary"
              >
                Voir détails
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal de détails de réservation -->
    <div v-if="showBookingDetailsModal" class="modal-overlay" @click="closeBookingDetails">
    <div class="modal-content booking-details-modal" @click.stop>
      <div class="modal-header">
        <h3>Détails de la réservation</h3>
        <button @click="closeBookingDetails" class="close-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="modal-body" v-if="selectedBooking">
        <div class="booking-details-grid">
          <!-- Image de la propriété -->
          <div class="detail-section property-preview">
            <img 
              :src="getPropertyImageSrc(selectedBooking.property)" 
              :alt="selectedBooking.property?.title"
              @error="(e) => handleImageError(e, selectedBooking?.property?.type)"
              class="property-image"
            />
            <div class="property-type-overlay">
              <svg v-if="selectedBooking.property?.type === 'house'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <svg v-else-if="selectedBooking.property?.type === 'apartment'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/>
                <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>
              </svg>
              <svg v-else-if="selectedBooking.property?.type === 'office'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 21h18M3 7v1a3 3 0 003 3h12a3 3 0 003-3V7"/>
                <path d="M3 7l6-3 6 3 6-3v11"/>
                <path d="M8 12v.01M12 12v.01M16 12v.01"/>
              </svg>
            </div>
            <div class="property-info">
              <h4>{{ selectedBooking.property?.title }}</h4>
              <p class="property-address">{{ selectedBooking.property?.address }}</p>
              <div v-if="selectedBooking.property?.type" class="property-type-badge">{{ getTypeLabel(selectedBooking.property.type) }}</div>
            </div>
          </div>

          <!-- Informations de réservation -->
          <div class="detail-section">
            <h4>Informations de séjour</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="detail-label">Dates de séjour</div>
                <div class="detail-value">{{ formatDateRange(selectedBooking.start_date, selectedBooking.end_date) }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Nombre d'invités</div>
                <div class="detail-value">{{ selectedBooking.guests }} invité{{ selectedBooking.guests > 1 ? 's' : '' }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Statut</div>
                <div class="detail-value">
                  <span class="status-badge" :class="selectedBooking.status">
                    {{ getStatusLabel(selectedBooking.status) }}
                  </span>
                </div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Prix total</div>
                <div class="detail-value price">{{ formatPrice(selectedBooking.total_price) }}</div>
              </div>
            </div>
          </div>

          <!-- Notes de réservation -->
          <div v-if="selectedBooking.special_requests" class="detail-section">
            <h4>Demandes spéciales</h4>
            <p class="notes-text">{{ selectedBooking.special_requests }}</p>
          </div>
        </div>
      </div>
      
      <div class="modal-actions">
        <button @click="closeBookingDetails" class="btn secondary">Fermer</button>
        <router-link 
          :to="`/client/properties/${selectedBooking?.property?.id}`" 
          class="btn primary"
          @click="closeBookingDetails"
        >
          Voir la propriété
        </router-link>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useBookingsStore } from '../../stores/bookings'
import { usePropertiesStore } from '../../stores/properties'
import type { Booking } from '../../stores/bookings'

// Variables d'environnement
const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost'

const authStore = useAuthStore()
const bookingsStore = useBookingsStore()
const propertiesStore = usePropertiesStore()

// Variables réactives pour la modal de détails
const showBookingDetailsModal = ref(false)
const selectedBooking = ref<Booking | null>(null)

// Computed
const totalBookings = computed(() => bookingsStore.bookings.length)
const pendingBookings = computed(() => bookingsStore.pendingBookings)
const confirmedBookings = computed(() => bookingsStore.confirmedBookings)
const upcomingBookings = computed(() => bookingsStore.upcomingBookings)

const recentBookings = computed(() => 
  bookingsStore.bookings.slice(0, 3)
)

const recommendedProperties = computed(() => {
  const properties = propertiesStore.availableProperties.slice(0, 6)
  if (isDevelopment) {
    console.log('🏠 Propriétés recommandées:', properties.length, 'propriétés')
    properties.forEach((prop, index) => {
      console.log(`🏠 Propriété ${index + 1}:`, prop.title, 'Images:', prop.images)
    })
  }
  return properties
})

// Méthodes
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate).toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  })
  const end = new Date(endDate).toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  })
  return `${start} - ${end}`
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    cancelled: 'Annulée',
    completed: 'Terminée'
  }
  return labels[status] || status
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    house: 'Maison',
    apartment: 'Appartement',
    office: 'Bureau'
  }
  return labels[type] || type
}

const handleImageError = (event: Event, propertyType?: string) => {
  const img = event.target as HTMLImageElement
  img.src = getDefaultImage(propertyType)
}

const getDefaultImage = (type?: string) => {
  switch (type) {
    case 'house':
      return '/images/default-house.svg'
    case 'apartment':
      return '/images/default-apartment.svg'
    case 'office':
      return '/images/default-office.svg'
    default:
      return '/placeholder-property.jpg' // Garder le fichier existant pour compatibilité
  }
}

const getPropertyImageUrl = (imagePath?: string) => {
  if (!imagePath) return null
  
  // Si l'image commence par http/https, c'est une URL complète
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // Sinon, construire l'URL avec le domaine du backend
  const backendUrl = 'http://localhost:8000' // En développement, utiliser l'URL par défaut
  return `${backendUrl}/${imagePath}`
}

const getPropertyImageSrc = (property?: { images?: string[]; type?: string } | null) => {
  if (!property) {
    if (isDevelopment) {
      console.log('🖼️ Pas de propriété fournie, utilisation de l\'image par défaut')
    }
    return getDefaultImage()
  }
  
  if (isDevelopment) {
    console.log('🖼️ Propriété:', (property as { title?: string }).title || 'Sans titre', 'Images:', property.images)
  }
  
  // Si la propriété a des images
  if (property.images && property.images.length > 0) {
    const firstImage = property.images[0]
    if (isDevelopment) {
      console.log('🖼️ Première image trouvée:', firstImage)
    }
    
    // Utiliser la fonction d'URL améliorée
    const imageUrl = getPropertyImageUrl(firstImage)
    if (isDevelopment) {
      console.log('🖼️ URL finale generée:', imageUrl)
    }
    if (imageUrl) return imageUrl
  }
  
  // Si pas d'images, retourner l'image par défaut selon le type
  if (isDevelopment) {
    console.log('🖼️ Aucune image, utilisation du type par défaut:', property.type)
  }
  return getDefaultImage(property.type)
}

// Fonctions pour la modal de détails
const openBookingDetails = (booking: Booking) => {
  selectedBooking.value = booking
  showBookingDetailsModal.value = true
}

const closeBookingDetails = () => {
  showBookingDetailsModal.value = false
  selectedBooking.value = null
}

// Debug functions
const debugReloadProperties = async () => {
  console.log('🔄 Debug: Rechargement manuel des propriétés...')
  console.log('📊 État avant:', {
    isLoading: propertiesStore.isLoading,
    properties: propertiesStore.properties.length,
    available: propertiesStore.availableProperties.length,
    error: propertiesStore.error
  })
  
  try {
    const result = await propertiesStore.fetchProperties()
    console.log('✅ Résultat debug:', result)
    console.log('📊 État après:', {
      isLoading: propertiesStore.isLoading,
      properties: propertiesStore.properties.length,
      available: propertiesStore.availableProperties.length,
      error: propertiesStore.error
    })
  } catch (error) {
    console.error('❌ Erreur debug:', error)
  }
}

const testApiDirect = async () => {
  console.log('🧪 Test API direct...')
  try {
    const response = await fetch('http://localhost:8000/api/properties')
    console.log('📡 Status:', response.status)
    console.log('📡 Headers:', response.headers)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Data:', data)
      console.log('📊 Propriétés data:', data.properties?.data?.length || 'N/A')
    } else {
      console.error('❌ Response not OK:', response.statusText)
    }
  } catch (error) {
    console.error('❌ Fetch error:', error)
  }
}

// Données de test pour le développement
const createTestProperties = () => {
  return [
    {
      id: 1,
      title: 'Appartement Moderne Centre-Ville',
      description: 'Magnifique appartement au cœur de la ville',
      type: 'apartment' as const,
      price_per_night: 120,
      address: '123 Rue de la République, Paris',
      bedrooms: 2,
      bathrooms: 1,
      area: 65,
      status: 'available' as const,
      manager_id: 1,
      images: ['/placeholder-property.svg'],
      rating: 4.5,
      reviewsCount: 12,
      guests: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Maison Familiale avec Jardin',
      description: 'Grande maison parfaite pour les familles',
      type: 'house' as const,
      price_per_night: 200,
      address: '456 Avenue des Champs, Lyon',
      bedrooms: 4,
      bathrooms: 2,
      area: 120,
      status: 'available' as const,
      manager_id: 1,
      images: ['/placeholder-property.svg'],
      rating: 4.8,
      reviewsCount: 25,
      guests: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Bureau Moderne Quartier d\'Affaires',
      description: 'Espace de travail professionnel',
      type: 'office' as const,
      price_per_night: 80,
      address: '789 Boulevard Business, Marseille',
      bedrooms: 0,
      bathrooms: 1,
      area: 45,
      status: 'available' as const,
      manager_id: 1,
      images: ['/placeholder-property.svg'],
      rating: 4.2,
      reviewsCount: 8,
      guests: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
}

// Lifecycle
onMounted(async () => {
  if (isDevelopment) {
    console.log('🚀 Chargement du dashboard client...')
  }
  try {
    // Charger les réservations
    await bookingsStore.fetchMyBookings()
    
    // Charger les propriétés
    if (isDevelopment) {
      console.log('📡 Début du chargement des propriétés...')
    }
    
    const result = await propertiesStore.fetchProperties()
    
    if (isDevelopment) {
      console.log('✅ Résultat fetchProperties:', result)
      console.log('📊 isLoading après fetch:', propertiesStore.isLoading)
      console.log('📊 Propriétés disponibles:', propertiesStore.availableProperties.length)
      console.log('📊 Toutes les propriétés:', propertiesStore.properties.length)
      console.log('❌ Erreur:', propertiesStore.error)
      
      // Si aucune propriété n'est chargée, ajouter des données de test
      if (propertiesStore.properties.length === 0) {
        console.log('🧪 Ajout de propriétés de test...')
        propertiesStore.setTestProperties(createTestProperties())
        console.log('✅ Propriétés de test ajoutées:', propertiesStore.properties.length)
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement:', error)
    
    // En cas d'erreur, ajouter des données de test en développement
    if (isDevelopment) {
      console.log('🧪 Ajout de propriétés de test suite à l\'erreur...')
      propertiesStore.setTestProperties(createTestProperties())
    }
  }
})
</script>

<style scoped>
@import url('../../assets/cyber-theme.css');
@import url('../../assets/ultra-modern-theme.css');

.client-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  padding: 2rem;
}

.dashboard-header {
  background: linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.client-welcome-title {
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  text-shadow: 0 4px 12px rgba(67, 0, 255, 0.3) !important;
  position: relative;
}

.client-welcome-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, #4300FF, #0065F8);
  border-radius: 2px;
}

.welcome-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: var(--border-radius-medium);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition-smooth);
  backdrop-filter: blur(10px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%) !important;
  color: white !important;
  box-shadow: 0 8px 32px rgba(67, 0, 255, 0.35), 0 4px 16px rgba(0, 101, 248, 0.25) !important;
  border: none !important;
  position: relative;
  overflow: hidden;
}

.action-btn.primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.action-btn.primary:hover::before {
  left: 100%;
}

.action-btn.primary:hover {
  transform: translateY(-4px) scale(1.02) !important;
  box-shadow: 0 12px 48px rgba(67, 0, 255, 0.45), 0 8px 24px rgba(0, 101, 248, 0.35) !important;
  filter: brightness(1.1) !important;
}

.action-btn.secondary {
  background: linear-gradient(135deg, rgba(67, 0, 255, 0.1) 0%, rgba(0, 101, 248, 0.1) 50%, rgba(0, 202, 255, 0.1) 100%) !important;
  border: 2px solid transparent !important;
  background-clip: padding-box !important;
  color: #4300FF !important;
  position: relative;
  overflow: hidden;
}

.action-btn.secondary::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 2px;
  background: linear-gradient(135deg, #4300FF, #0065F8, #00CAFF);
  border-radius: inherit;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

.action-btn.secondary:hover {
  background: linear-gradient(135deg, rgba(67, 0, 255, 0.2) 0%, rgba(0, 101, 248, 0.2) 50%, rgba(0, 202, 255, 0.2) 100%) !important;
  transform: translateY(-3px) scale(1.02) !important;
  box-shadow: 0 8px 32px rgba(67, 0, 255, 0.25) !important;
  color: #0065F8 !important;
}

.action-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.stats-section {
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-large);
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15), 0 8px 12px rgba(0, 0, 0, 0.1);
  border-color: #4f46e5;
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.stat-icon.pending {
  background: var(--warning-gradient, linear-gradient(135deg, #f59e0b, #d97706));
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
}

.stat-icon.confirmed {
  background: var(--success-gradient, linear-gradient(135deg, #10b981, #059669));
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.stat-icon.upcoming {
  background: var(--info-gradient, linear-gradient(135deg, #3b82f6, #2563eb));
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

.stat-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: white;
}

.stat-number {
  font-size: 2rem;
  font-weight: 900;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dashboard-content {
  display: grid;
  gap: 3rem;
}

.content-section {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15), 0 8px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 1.5rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 2px;
  position: absolute;
  left: -1rem;
  top: 50%;
  transform: translateY(-50%);
}

.see-all-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
  border: 1px solid rgba(79, 70, 229, 0.2);
}

.see-all-link:hover {
  color: #7c3aed;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%);
  border-color: #7c3aed;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.see-all-link svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.loading-state .spinner,
.empty-state .empty-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid var(--electric-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.empty-icon {
  color: var(--text-muted);
}

.empty-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.empty-state h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%) !important;
  color: white !important;
  text-decoration: none !important;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  margin-top: 1rem;
  box-shadow: 0 8px 32px rgba(67, 0, 255, 0.35), 0 4px 16px rgba(0, 101, 248, 0.25) !important;
  border: none !important;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease !important;
}

.cta-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.cta-btn:hover::before {
  left: 100%;
}

.cta-btn:hover {
  transform: translateY(-4px) scale(1.05) !important;
  box-shadow: 0 12px 48px rgba(67, 0, 255, 0.45), 0 8px 24px rgba(0, 101, 248, 0.35) !important;
  filter: brightness(1.1) !important;
  text-decoration: none !important;
}

.bookings-list {
  display: grid;
  gap: 1.5rem;
}

.booking-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-medium);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  align-items: center;
  position: relative;
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.booking-card:hover {
  background: linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 100%);
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15), 0 8px 12px rgba(0, 0, 0, 0.1);
  border-color: #4f46e5;
}

.booking-image {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: var(--border-radius-medium);
  overflow: hidden;
}

.booking-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-smooth);
}

.booking-card:hover .booking-image img {
  transform: scale(1.05);
}

.property-type-icon {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  width: 1.75rem;
  height: 1.75rem;
  background: var(--glass-bg-dark);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--electric-blue);
}

.property-type-icon svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  stroke-width: 2;
}

.booking-status {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.3rem 0.6rem;
  border-radius: var(--border-radius-small);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.booking-status.pending {
  background: rgba(251, 191, 36, 0.9);
  color: #92400e;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
}

.booking-status.confirmed {
  background: rgba(34, 197, 94, 0.9);
  color: #14532d;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
}

.booking-status.cancelled {
  background: rgba(239, 68, 68, 0.9);
  color: #7f1d1d;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}

.booking-status.completed {
  background: rgba(59, 130, 246, 0.9);
  color: #1e3a8a;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

.booking-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.booking-address {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.booking-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.detail-item svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.booking-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--electric-blue);
}

.booking-actions {
  display: flex;
  align-items: center;
}

.details-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
  color: white !important;
  border: none !important;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  justify-content: center;
  min-width: 100px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
}

.details-btn:hover {
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4) !important;
}

.details-btn svg {
  width: 1.125rem;
  height: 1.125rem;
  stroke: currentColor;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.property-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.property-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15), 0 8px 12px rgba(0, 0, 0, 0.1);
  border-color: #4f46e5;
}

.property-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.property-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.property-type {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.property-content {
  padding: 1.5rem;
}

.property-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.property-address {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.property-features {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.feature svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.property-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--electric-blue);
  margin-bottom: 1rem;
}

.property-actions {
  padding: 0 1.5rem 1.5rem;
}

.view-btn {
  display: block;
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
  color: white !important;
  text-align: center;
  text-decoration: none !important;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
  position: relative;
  overflow: hidden;
}

.view-btn:hover {
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4) !important;
}

/* Override ultra-modern styles for buttons */
.details-btn.ultra-modern-btn.ultra-modern-btn-primary,
.view-btn.ultra-modern-btn.ultra-modern-btn-primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
  text-decoration: none !important;
}

.details-btn.ultra-modern-btn.ultra-modern-btn-primary:hover,
.view-btn.ultra-modern-btn.ultra-modern-btn-primary:hover {
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4) !important;
  color: white !important;
  text-decoration: none !important;
}

/* Responsive */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .client-dashboard {
    padding: 1rem;
  }
  
  .dashboard-header,
  .content-section {
    padding: 1.5rem;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .booking-card {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }
  
  .booking-image {
    width: 100%;
    height: 180px;
    justify-self: center;
  }
  
  .booking-content {
    order: 2;
  }
  
  .booking-actions {
    order: 3;
    justify-content: center;
  }
  
  .properties-grid {
    grid-template-columns: 1fr;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .property-preview {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-large);
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from { 
    opacity: 0;
    transform: translateY(50px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.booking-details-modal {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius-small);
  transition: var(--transition-smooth);
}

.close-btn:hover {
  background: var(--glass-bg-light);
  color: var(--text-primary);
}

.close-btn svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
}

.modal-body {
  padding: 2rem;
}

.booking-details-grid {
  display: grid;
  gap: 2rem;
}

.detail-section {
  background: linear-gradient(145deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-medium);
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-section:hover {
  background: linear-gradient(145deg, rgba(240, 249, 255, 0.8) 0%, rgba(224, 242, 254, 0.8) 100%);
  border-color: #4f46e5;
}

.detail-section h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.property-preview {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  align-items: start;
}

.property-preview .property-image {
  width: 100%;
  height: 150px;
  border-radius: var(--border-radius-medium);
  object-fit: cover;
  position: relative;
}

.property-type-overlay {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--glass-bg-dark);
  backdrop-filter: blur(15px);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--electric-blue);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.property-type-overlay svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
  stroke-width: 2;
}

.property-info h4 {
  margin-bottom: 0.5rem;
}

.property-address {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.property-type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--primary-gradient);
  color: white;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
}

.detail-value {
  font-weight: 600;
  color: var(--text-primary);
}

.detail-value.price {
  font-size: 1.25rem;
  color: var(--electric-blue);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.status-badge.confirmed {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.status-badge.completed {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--glass-bg-medium);
  border-radius: var(--border-radius-small);
}

.service-name {
  color: var(--text-primary);
  font-weight: 500;
}

.service-price {
  color: var(--electric-blue);
  font-weight: 600;
}

.notes-text {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid var(--glass-border);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: var(--transition-smooth);
}



.btn.primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn.primary:hover {
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
}

.btn.secondary {
  background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #cbd5e1;
  color: #64748b;
  box-shadow: 0 2px 6px rgba(100, 116, 139, 0.2);
}

.btn.secondary:hover {
  background: linear-gradient(145deg, #e2e8f0 0%, #cbd5e1 100%);
  color: #475569;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-actions {
    padding: 1.5rem;
  }
  
  .property-preview {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
