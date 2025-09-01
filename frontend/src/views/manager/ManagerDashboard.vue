<template>
  <div class="manager-dashboard ultra-modern-layout">
    <!-- En-tête avec navigation -->
    <div class="dashboard-header ultra-modern-card">
      <div class="header-content">
        <div class="manager-info">
          <div class="manager-avatar">
            <div class="avatar-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
          </div>
          <div class="manager-details">
            <h1 class="welcome-title">Manager Dashboard</h1>
            <p class="welcome-subtitle">{{ authStore.userName }}</p>
            <div class="status-badge active">
              <div class="status-dot"></div>
              Compte Actif
            </div>
          </div>
        </div>
        
        <div class="quick-actions">
          <router-link to="/manager/properties/add" class="action-btn primary ultra-modern-btn ultra-modern-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Ajouter une propriété
          </router-link>
          
          <router-link to="/manager/properties" class="action-btn secondary ultra-modern-btn ultra-modern-btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            Gérer mes propriétés
          </router-link>
        </div>
      </div>
    </div>

    <!-- Statistiques avancées -->
    <div class="stats-overview">
      <div class="stats-container">
        <div class="stat-card earnings ultra-modern-card ultra-modern-animate-fade-scale">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ formatPrice(totalEarnings) }}</div>
            <div class="stat-label">Revenus totaux</div>
            <div class="stat-trend positive">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
              +12% ce mois
            </div>
          </div>
        </div>

        <div class="stat-card properties ultra-modern-card ultra-modern-animate-fade-scale">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ totalProperties }}</div>
            <div class="stat-label">Propriétés gérées</div>
            <div class="stat-breakdown">
              <span class="breakdown-item">{{ availableProperties }} disponibles</span>
            </div>
          </div>
        </div>

        <div class="stat-card bookings ultra-modern-card ultra-modern-animate-fade-scale">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ totalBookings }}</div>
            <div class="stat-label">Réservations</div>
            <div class="stat-breakdown">
              <span class="breakdown-item pending">{{ pendingBookings }} en attente</span>
            </div>
          </div>
        </div>

        <div class="stat-card occupancy ultra-modern-card ultra-modern-animate-fade-scale">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ occupancyRate }}%</div>
            <div class="stat-label">Taux d'occupation</div>
            <div class="stat-trend positive">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
              +5% ce mois
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="dashboard-content">
      <!-- Réservations récentes nécessitant une action -->
      <div class="content-section priority ultra-modern-card">
        <div class="section-header">
          <h2 class="section-title">
            <div class="title-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            Actions requises
          </h2>
          <div class="priority-badge">
            {{ pendingBookings }} en attente
          </div>
        </div>
        
        <div v-if="isLoadingBookings" class="loading-state">
          <div class="cyber-spinner"></div>
          <p>Chargement des réservations...</p>
        </div>
        
        <div v-else-if="managerBookings.slice(0, 3).length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3>Aucune action requise</h3>
          <p>Toutes vos réservations sont à jour !</p>
        </div>
        
        <div v-else class="bookings-list">
          <div 
            v-for="booking in managerBookings.filter(b => b.status === 'pending').slice(0, 3)" 
            :key="booking.id" 
            class="booking-card urgent"
          >
            <div class="booking-info">
              <div class="booking-header">
                <h3 class="property-name">{{ booking.property?.title }}</h3>
                <div class="booking-status pending">En attente</div>
              </div>
              
              <div class="client-info">
                <div class="client-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div class="client-details">
                  <span class="client-name">{{ booking.client?.name }}</span>
                  <span class="client-email">{{ booking.client?.email }}</span>
                </div>
              </div>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Période :</span>
                  <span class="detail-value">{{ formatDateRange(booking.start_date, booking.end_date) }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Invités :</span>
                  <span class="detail-value">{{ booking.guests }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Montant :</span>
                  <span class="detail-value price">{{ formatPrice(booking.total_price) }}</span>
                </div>
              </div>
            </div>
            
            <div class="booking-actions">
              <button @click="confirmBooking(booking.id)" class="action-btn confirm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Confirmer
              </button>
              <button @click="openCancelModal(booking)" class="action-btn reject">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Refuser
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="managerBookings.filter(b => b.status === 'pending').length > 3" class="show-more">
          <router-link to="/manager/bookings" class="show-more-btn">
            Voir toutes les réservations en attente ({{ managerBookings.filter(b => b.status === 'pending').length }})
          </router-link>
        </div>
      </div>

      <!-- Aperçu des propriétés -->
      <div class="content-section ultra-modern-card">
        <div class="section-header">
          <h2 class="section-title ultra-modern-text-gradient">
            <div class="title-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            Mes propriétés
          </h2>
          <router-link to="/manager/properties" class="see-all-link">
            Gérer tout
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
        
        <div v-if="isLoadingProperties" class="loading-state">
          <div class="cyber-spinner"></div>
          <p>Chargement de vos propriétés...</p>
        </div>
        
        <div v-else class="properties-grid">
          <div 
            v-for="property in myProperties.slice(0, 4)" 
            :key="property.id" 
            class="property-card ultra-modern-card ultra-modern-animate-fade-scale"
            :class="{ 'low-performance': getOccupancyRate() < 50 }"
          >
            <div class="property-image">
              <img 
                :src="getPropertyImageUrl(property.images?.[0]) || '/placeholder-property.svg'" 
                :alt="property.title"
                @error="handleImageError"
              />
              <div class="property-status" :class="property.status">
                {{ getStatusLabel(property.status) }}
              </div>
              <div class="property-type">{{ getTypeLabel(property.type) }}</div>
            </div>
            
            <div class="property-content">
              <h3 class="property-title ultra-modern-text-primary">{{ property.title }}</h3>
              <p class="property-address ultra-modern-text-secondary">{{ property.address }}</p>
              
              <div class="property-metrics">
                <div class="metric">
                  <span class="metric-label">Occupation</span>
                  <div class="metric-bar">
                    <div 
                      class="metric-fill" 
                      :style="{ width: getOccupancyRate() + '%' }"
                      :class="{ 'low': getOccupancyRate() < 50 }"
                    ></div>
                  </div>
                  <span class="metric-value">{{ getOccupancyRate() }}%</span>
                </div>
                
                <div class="metric">
                  <span class="metric-label">Prix/nuit</span>
                  <span class="metric-value price">{{ formatPrice(property.price_per_night) }}</span>
                </div>
              </div>
              
              <div class="property-actions">
                <router-link 
                  :to="`/manager/properties/${property.id}/edit`" 
                  class="action-link edit ultra-modern-btn ultra-modern-btn-outline"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Modifier
                </router-link>
                <button @click="viewPropertyBookings(property.id)" class="action-link view ultra-modern-btn ultra-modern-btn-secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Réservations
                </button>
              </div>
            </div>
          </div>
          
          <!-- Carte d'ajout rapide -->
          <router-link to="/manager/properties/add" class="add-property-card ultra-modern-card ultra-modern-animate-fade-scale">
            <div class="add-icon ultra-modern-gradient-bg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <h3 class="ultra-modern-text-gradient">Ajouter une propriété</h3>
            <p class="ultra-modern-text-secondary">Développez votre portefeuille</p>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal d'annulation -->
    <div v-if="showCancelModal" class="modal-overlay" @click="closeCancelModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Refuser la réservation</h3>
          <button @click="closeCancelModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <p>Pourquoi refusez-vous cette réservation ?</p>
          <textarea 
            v-model="cancelReason" 
            placeholder="Expliquez la raison du refus..."
            class="cancel-reason-input"
            rows="4"
          ></textarea>
        </div>
        
        <div class="modal-actions">
          <button @click="closeCancelModal" class="btn secondary">Annuler</button>
          <button @click="cancelBooking" class="btn danger" :disabled="!cancelReason.trim()">
            Confirmer le refus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useBookingsStore, type Booking } from '../../stores/bookings'
import { usePropertiesStore } from '../../stores/properties'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const bookingsStore = useBookingsStore()
const propertiesStore = usePropertiesStore()
const router = useRouter()

// État local
const isLoadingBookings = ref(false)
const isLoadingProperties = ref(false)
const showCancelModal = ref(false)
const selectedBooking = ref<Booking | null>(null)
const cancelReason = ref('')

// Computed
const totalEarnings = computed(() => {
  return managerBookings.value
    .filter(b => b.status === 'completed')
    .reduce((sum, booking) => sum + booking.total_price, 0)
})

const totalProperties = computed(() => propertiesStore.myProperties.length)
const availableProperties = computed(() => 
  propertiesStore.myProperties.filter(p => p.status === 'available').length
)

const totalBookings = computed(() => bookingsStore.managerBookings.length)
const pendingBookings = computed(() => 
  bookingsStore.managerBookings.filter(b => b.status === 'pending').length
)

const occupancyRate = computed(() => {
  const total = totalProperties.value
  if (total === 0) return 0
  const occupied = propertiesStore.myProperties.filter(p => p.status === 'occupied').length
  return Math.round((occupied / total) * 100)
})

const managerBookings = computed(() => bookingsStore.managerBookings)
const myProperties = computed(() => propertiesStore.myProperties)

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
    available: 'Disponible',
    occupied: 'Occupé',
    maintenance: 'Maintenance'
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

const getOccupancyRate = () => {
  // Simulation - dans un vrai projet, cela viendrait des données de la propriété
  return Math.floor(Math.random() * 100)
}

const getPropertyImageUrl = (imagePath?: string) => {
  if (!imagePath) return null
  
  // Si l'image commence par http/https, c'est une URL complète
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // Sinon, construire l'URL avec le domaine du backend
  const backendUrl = 'http://localhost:8000' // TODO: Configurer via une variable d'environnement
  return `${backendUrl}/${imagePath}`
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-property.svg'
}

const confirmBooking = async (bookingId: number) => {
  try {
    const result = await bookingsStore.confirmBooking(bookingId)
    if (result.success) {
      // Notification de succès
      console.log('Réservation confirmée avec succès')
    }
  } catch (error) {
    console.error('Erreur lors de la confirmation:', error)
  }
}

const openCancelModal = (booking: Booking) => {
  selectedBooking.value = booking
  showCancelModal.value = true
  cancelReason.value = ''
}

const closeCancelModal = () => {
  showCancelModal.value = false
  selectedBooking.value = null
  cancelReason.value = ''
}

const cancelBooking = async () => {
  if (!selectedBooking.value || !cancelReason.value.trim()) return
  
  try {
    const result = await bookingsStore.cancelBooking(selectedBooking.value.id, cancelReason.value)
    if (result.success) {
      closeCancelModal()
      console.log('Réservation refusée avec succès')
    }
  } catch (error) {
    console.error('Erreur lors du refus:', error)
  }
}

const viewPropertyBookings = (propertyId: number) => {
  router.push(`/manager/bookings?property=${propertyId}`)
}

// Lifecycle
onMounted(async () => {
  isLoadingBookings.value = true
  isLoadingProperties.value = true
  
  await Promise.all([
    bookingsStore.fetchManagerBookings(),
    propertiesStore.fetchMyProperties()
  ])
  
  isLoadingBookings.value = false
  isLoadingProperties.value = false
})
</script>

<style scoped>
@import url('../../assets/dashboard-professional.css');
@import url('../../assets/ultra-modern-theme.css');

.manager-dashboard {
  min-height: 100vh;
  background: var(--bg-main);
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.dashboard-header {
  background: var(--card-bg);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-card);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.manager-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.manager-avatar {
  position: relative;
}

.avatar-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(67, 0, 255, 0.4), 0 0 20px rgba(0, 101, 248, 0.3);
  animation: avatar-pulse 3s ease-in-out infinite;
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.avatar-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
}

@keyframes avatar-pulse {
  0%, 100% { 
    box-shadow: 0 8px 32px rgba(67, 0, 255, 0.4), 0 0 20px rgba(0, 101, 248, 0.3);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 12px 48px rgba(67, 0, 255, 0.6), 0 0 30px rgba(0, 202, 255, 0.5);
    transform: scale(1.05);
  }
}

.avatar-icon svg {
  width: 2rem;
  height: 2rem;
  stroke: white;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 12px rgba(67, 0, 255, 0.3);
  position: relative;
}

.welcome-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, #4300FF, #0065F8);
  border-radius: 1px;
}

.welcome-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--border-radius-medium);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--acid-green);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--acid-green);
  border-radius: 50%;
  animation: status-pulse 2s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.quick-actions {
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
  background: var(--primary-color);
  color: white;
  box-shadow: 0 2px 8px rgba(67, 0, 255, 0.2);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(67, 0, 255, 0.3);
  background: var(--secondary-color);
}

.action-btn.secondary {
  background: var(--card-bg);
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.action-btn.secondary:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.action-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.stats-overview {
  margin-bottom: 3rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-large);
  padding: 2rem;
  transition: var(--transition-smooth);
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--primary-color);
}

.stat-card.earnings::before { background: var(--emerald-green); }
.stat-card.properties::before { background: var(--primary-color); }
.stat-card.bookings::before { background: var(--golden-yellow); }
.stat-card.occupancy::before { background: var(--secondary-color); }

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevated);
  border-color: var(--primary-color);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-neon-blue);
}

.stat-card.earnings .stat-icon { background: var(--success-gradient, linear-gradient(135deg, #10b981, #059669)); }
.stat-card.bookings .stat-icon { background: var(--warning-gradient, linear-gradient(135deg, #f59e0b, #d97706)); }
.stat-card.occupancy .stat-icon { background: var(--info-gradient, linear-gradient(135deg, #3b82f6, #2563eb)); }

.stat-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: white;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-trend.positive {
  color: var(--acid-green);
}

.stat-trend svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.stat-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.breakdown-item {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.breakdown-item.pending {
  color: var(--solar-orange);
  font-weight: 600;
}

.dashboard-content {
  display: grid;
  gap: 3rem;
}

.content-section {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  box-shadow: var(--shadow-cyber);
}

.content-section.priority {
  border-color: var(--solar-orange);
  box-shadow: 0 0 30px rgba(255, 165, 0, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.title-icon {
  width: 2rem;
  height: 2rem;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-icon svg {
  width: 1rem;
  height: 1rem;
  stroke: white;
}

.priority-badge {
  padding: 0.5rem 1rem;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: var(--border-radius-medium);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--solar-orange);
  animation: priority-pulse 2s ease-in-out infinite;
}

@keyframes priority-pulse {
  0%, 100% { 
    background: rgba(255, 165, 0, 0.1);
    border-color: rgba(255, 165, 0, 0.3);
  }
  50% { 
    background: rgba(255, 165, 0, 0.2);
    border-color: rgba(255, 165, 0, 0.5);
  }
}

.see-all-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--electric-blue);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition-smooth);
}

.see-all-link:hover {
  color: var(--neon-cyan);
  text-shadow: 0 0 10px var(--neon-cyan);
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

.cyber-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid var(--electric-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  color: var(--acid-green);
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

.bookings-list {
  display: grid;
  gap: 1.5rem;
}

.booking-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  padding: 2rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  transition: var(--transition-smooth);
}

.booking-card.urgent {
  border-color: var(--solar-orange);
  background: rgba(255, 165, 0, 0.05);
}

.booking-card:hover {
  background: var(--glass-bg-medium);
  transform: translateX(5px);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.property-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.booking-status {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.booking-status.pending {
  background: rgba(255, 165, 0, 0.1);
  color: var(--solar-orange);
  border: 1px solid rgba(255, 165, 0, 0.3);
}

.client-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.client-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--glass-bg-strong);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.client-avatar svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: var(--text-muted);
}

.client-name {
  font-weight: 600;
  color: var(--text-primary);
  display: block;
}

.client-email {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.booking-details {
  display: grid;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.detail-value {
  font-weight: 600;
  color: var(--text-primary);
}

.detail-value.price {
  color: var(--electric-blue);
  font-size: 1.125rem;
}

.booking-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.action-btn.confirm {
  background: var(--success-gradient, linear-gradient(135deg, #10b981, #059669));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn.confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.action-btn.reject {
  background: var(--glass-bg-medium);
  border: 1px solid var(--laser-red);
  color: var(--laser-red);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn.reject:hover {
  background: rgba(255, 0, 64, 0.1);
  transform: translateY(-2px);
}

.action-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.show-more {
  margin-top: 1.5rem;
  text-align: center;
}

.show-more-btn {
  color: var(--electric-blue);
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--electric-blue);
  border-radius: var(--border-radius-medium);
  transition: var(--transition-smooth);
}

.show-more-btn:hover {
  background: rgba(0, 229, 255, 0.1);
  color: var(--neon-cyan);
  border-color: var(--neon-cyan);
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.property-card {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  transition: var(--transition-smooth);
}

.property-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}

.property-card.low-performance {
  border-color: var(--solar-orange);
  background: rgba(255, 165, 0, 0.05);
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

.property-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

.property-status.available {
  background: rgba(16, 185, 129, 0.2);
  color: var(--acid-green);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.property-status.occupied {
  background: rgba(245, 158, 11, 0.2);
  color: var(--solar-orange);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.property-status.maintenance {
  background: rgba(255, 0, 64, 0.2);
  color: var(--laser-red);
  border: 1px solid rgba(255, 0, 64, 0.3);
}

.property-type {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 0.75rem;
  background: var(--primary-gradient);
  color: white;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
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
  margin-bottom: 1.5rem;
}

.property-metrics {
  margin-bottom: 1.5rem;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric:last-child {
  margin-bottom: 0;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.metric-bar {
  flex: 1;
  height: 0.5rem;
  background: var(--glass-bg-strong);
  border-radius: 0.25rem;
  margin: 0 1rem;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  background: var(--electric-blue);
  transition: var(--transition-smooth);
}

.metric-fill.low {
  background: var(--solar-orange);
}

.metric-value {
  font-weight: 600;
  color: var(--text-primary);
}

.metric-value.price {
  color: var(--electric-blue);
}

.property-actions {
  display: flex;
  gap: 1rem;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-medium);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: var(--transition-smooth);
  flex: 1;
  justify-content: center;
}

.action-link.edit {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3), 0 0 20px rgba(37, 99, 235, 0.2);
  position: relative;
  overflow: hidden;
  font-weight: 700;
}

.action-link.edit::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.action-link.edit:hover::before {
  left: 100%;
}

.action-link.edit:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.5), 0 0 30px rgba(37, 99, 235, 0.3);
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #1E40AF 100%);
}

.action-link.view {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3), 0 0 20px rgba(217, 119, 6, 0.2);
  position: relative;
  overflow: hidden;
  font-weight: 700;
}

.action-link.view::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.action-link.view:hover::before {
  left: 100%;
}

.action-link.view:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.5), 0 0 30px rgba(217, 119, 6, 0.3);
  background: linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%);
}

.action-link svg {
  width: 1.125rem;
  height: 1.125rem;
  stroke: currentColor;
  stroke-width: 2.5;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  position: relative;
  z-index: 1;
}

.action-link:hover svg {
  transform: scale(1.1);
  stroke-width: 3;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Animations spécifiques pour chaque bouton */
.action-link.edit:hover svg {
  animation: edit-icon-rotate 0.6s ease-in-out;
}

.action-link.view:hover svg {
  animation: bookings-icon-bounce 0.8s ease-in-out;
}

@keyframes edit-icon-rotate {
  0%, 100% { transform: scale(1.1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(15deg); }
}

@keyframes bookings-icon-bounce {
  0%, 100% { transform: scale(1.1) translateY(0); }
  25% { transform: scale(1.15) translateY(-2px); }
  50% { transform: scale(1.2) translateY(-4px); }
  75% { transform: scale(1.15) translateY(-2px); }
}

/* Animations de pulsation pour attirer l'attention */
@keyframes button-pulse-blue {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3), 0 0 20px rgba(37, 99, 235, 0.2);
  }
  50% {
    box-shadow: 0 6px 24px rgba(59, 130, 246, 0.5), 0 0 30px rgba(37, 99, 235, 0.4);
  }
}

@keyframes button-pulse-orange {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3), 0 0 20px rgba(217, 119, 6, 0.2);
  }
  50% {
    box-shadow: 0 6px 24px rgba(245, 158, 11, 0.5), 0 0 30px rgba(217, 119, 6, 0.4);
  }
}

/* Application des animations de pulsation */
.action-link.edit:not(:hover) {
  animation: button-pulse-blue 3s ease-in-out infinite;
}

.action-link.view:not(:hover) {
  animation: button-pulse-orange 3s ease-in-out infinite 1.5s;
}

/* Surpasser les styles ultra-modern pour les boutons */
.action-link.edit.ultra-modern-btn.ultra-modern-btn-outline {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%) !important;
  border: 2px solid #3B82F6 !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3), 0 0 20px rgba(37, 99, 235, 0.2) !important;
  background-clip: border-box !important;
}

.action-link.edit.ultra-modern-btn.ultra-modern-btn-outline:hover {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #1E40AF 100%) !important;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.5), 0 0 30px rgba(37, 99, 235, 0.3) !important;
  border: 2px solid #2563EB !important;
}

.action-link.view.ultra-modern-btn.ultra-modern-btn-secondary {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%) !important;
  border: 2px solid #F59E0B !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3), 0 0 20px rgba(217, 119, 6, 0.2) !important;
  background-clip: border-box !important;
}

.action-link.view.ultra-modern-btn.ultra-modern-btn-secondary:hover {
  background: linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%) !important;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.5), 0 0 30px rgba(217, 119, 6, 0.3) !important;
  border: 2px solid #D97706 !important;
}

/* Supprimer complètement le pseudo-élément ::after qui crée le cadre bleu */
.action-link.view.ultra-modern-btn.ultra-modern-btn-secondary::after {
  display: none !important;
  content: none !important;
}

.action-link.edit.ultra-modern-btn.ultra-modern-btn-outline::after {
  display: none !important;
  content: none !important;
}

/* Appliquer les animations avec priorité élevée */
.action-link.edit.ultra-modern-btn:not(:hover) {
  animation: button-pulse-blue 3s ease-in-out infinite !important;
}

.action-link.view.ultra-modern-btn:not(:hover) {
  animation: button-pulse-orange 3s ease-in-out infinite 1.5s !important;
}

.add-property-card {
  background: var(--glass-bg-light);
  border: 2px dashed var(--glass-border);
  border-radius: var(--border-radius-medium);
  padding: 3rem 2rem;
  text-align: center;
  text-decoration: none;
  color: var(--text-secondary);
  transition: var(--transition-smooth);
}

.add-property-card:hover {
  border-color: var(--electric-blue);
  background: rgba(0, 229, 255, 0.05);
  color: var(--electric-blue);
  transform: translateY(-5px);
}

.add-icon {
  width: 3rem;
  height: 3rem;
  background: var(--glass-bg-medium);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  transition: var(--transition-smooth);
}

.add-property-card:hover .add-icon {
  background: var(--primary-gradient);
  color: white;
}

.add-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
}

.add-property-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.add-property-card p {
  font-size: 0.875rem;
  margin: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid var(--glass-border);
}

.modal-header h3 {
  color: var(--text-primary);
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
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
  color: var(--text-primary);
  background: var(--glass-bg-light);
}

.close-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.modal-body {
  padding: 2rem;
}

.modal-body p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.cancel-reason-input {
  width: 100%;
  padding: 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: var(--transition-smooth);
}

.cancel-reason-input:focus {
  outline: none;
  border-color: var(--electric-blue);
  background: var(--glass-bg-medium);
}

.cancel-reason-input::placeholder {
  color: var(--text-muted);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.875rem 1.5rem;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  border: none;
}

.btn.secondary {
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
}

.btn.secondary:hover {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
}

.btn.danger {
  background: var(--danger-gradient, linear-gradient(135deg, #ef4444, #dc2626));
  color: white;
}

.btn.danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Styles ultra modernes pour les cartes de propriétés */
.property-card.ultra-modern-card {
  background: var(--card-bg) !important;
  border: 1px solid var(--border-primary) !important;
  box-shadow: var(--shadow-card) !important;
  backdrop-filter: blur(20px) !important;
}

.property-card.ultra-modern-card:hover {
  border-color: var(--primary-color) !important;
  box-shadow: var(--shadow-elevated) !important;
  transform: translateY(-8px) scale(1.02) !important;
}

.property-card .property-type {
  background: var(--gradient-primary) !important;
  color: var(--pure-white) !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 12px rgba(67, 0, 255, 0.3) !important;
}

.property-card .property-status.available {
  background: rgba(16, 185, 129, 0.15) !important;
  border: 1px solid rgba(16, 185, 129, 0.4) !important;
  color: #10b981 !important;
  backdrop-filter: blur(10px) !important;
}

.property-card .property-status.occupied {
  background: rgba(245, 158, 11, 0.15) !important;
  border: 1px solid rgba(245, 158, 11, 0.4) !important;
  color: #f59e0b !important;
  backdrop-filter: blur(10px) !important;
}

.property-card .metric-fill {
  background: var(--gradient-primary) !important;
  box-shadow: 0 0 10px rgba(67, 0, 255, 0.3) !important;
}

.property-card .metric-value.price {
  background: var(--gradient-primary) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  font-weight: 700 !important;
}

/* Carte d'ajout de propriété ultra moderne */
.add-property-card.ultra-modern-card {
  background: var(--glassmorphism-bg) !important;
  border: 2px dashed var(--primary-color) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.add-property-card.ultra-modern-card:hover {
  background: var(--card-bg) !important;
  border-style: solid !important;
  border-color: var(--secondary-color) !important;
  box-shadow: var(--shadow-elevated) !important;
  transform: translateY(-8px) scale(1.05) !important;
}

.add-property-card .add-icon.ultra-modern-gradient-bg {
  background: var(--gradient-primary) !important;
  color: var(--pure-white) !important;
  box-shadow: var(--shadow-neon-blue) !important;
  transition: all 0.3s ease !important;
}

.add-property-card:hover .add-icon.ultra-modern-gradient-bg {
  transform: scale(1.1) rotate(90deg) !important;
  box-shadow: var(--shadow-cyber) !important;
}

/* Responsive */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .booking-card {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .booking-actions {
    flex-direction: row;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .manager-dashboard {
    padding: 1rem;
  }
  
  .dashboard-header,
  .content-section {
    padding: 1.5rem;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .properties-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header,
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-actions {
    padding: 1rem 1.5rem 1.5rem;
    flex-direction: column;
  }
}
</style>
