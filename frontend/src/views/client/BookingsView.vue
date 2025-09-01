<template>
  <div class="bookings-view ultra-modern-layout">
    <!-- En-tête -->
    <div class="bookings-header ultra-modern-card">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title ultra-modern-text-gradient client-title">Mes réservations</h1>
          <p class="page-subtitle ultra-modern-text-secondary">
            Gérez vos réservations et découvrez de nouveaux séjours
          </p>
        </div>
        
        <div class="header-stats">
          <div class="stat-item ultra-modern-card ultra-modern-animate-fade-scale">
            <div class="stat-number ultra-modern-text-primary">{{ totalBookings }}</div>
            <div class="stat-label ultra-modern-text-secondary">Réservations</div>
          </div>
          <div class="stat-item ultra-modern-card ultra-modern-animate-fade-scale">
            <div class="stat-number ultra-modern-text-primary">{{ upcomingBookings }}</div>
            <div class="stat-label ultra-modern-text-secondary">À venir</div>
          </div>
          <div class="stat-item ultra-modern-card ultra-modern-animate-fade-scale">
            <div class="stat-number ultra-modern-text-gradient">{{ formatPrice(totalSpent) }}</div>
            <div class="stat-label ultra-modern-text-secondary">Total dépensé</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres de statut -->
    <div class="status-filters">
      <button
        v-for="status in statusFilters"
        :key="status.value"
        @click="activeFilter = status.value"
        :class="{ active: activeFilter === status.value }"
        class="status-filter-btn ultra-modern-btn ultra-modern-btn-outline"
      >
        <div class="filter-icon" v-html="status.icon"></div>
        <span class="ultra-modern-text-secondary">{{ status.label }}</span>
        <span class="filter-count ultra-modern-badge ultra-modern-badge-primary">{{ getBookingCountByStatus(status.value) }}</span>
      </button>
    </div>

    <!-- Liste des réservations -->
    <div class="bookings-section ultra-modern-card">
      <div v-if="bookingsStore.isLoading" class="loading-state">
        <div class="cyber-spinner"></div>
        <p>Chargement de vos réservations...</p>
      </div>
      
      <div v-else-if="filteredBookings.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <h3>{{ activeFilter === 'all' ? 'Aucune réservation' : `Aucune réservation ${getStatusLabel(activeFilter)}` }}</h3>
        <p>{{ activeFilter === 'all' ? 'Découvrez nos propriétés exceptionnelles et faites votre première réservation.' : 'Changez de filtre pour voir vos autres réservations.' }}</p>
        <router-link v-if="activeFilter === 'all'" to="/client/properties" class="cta-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Découvrir les propriétés
        </router-link>
      </div>
      
              <div v-else class="bookings-grid">
        <div
          v-for="(booking, index) in filteredBookings"
          :key="booking.id"
          class="booking-card ultra-modern-card ultra-modern-animate-fade-scale"
          :class="booking.status"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="booking-image">
            <img
              :src="getPropertyImageSrc(booking.property?.images?.[0], booking.property?.type) || '/placeholder-property.jpg'"
              :alt="booking.property?.title"
              @error="(e) => handleImageError(e, booking.property?.type)"
            />
            <div class="booking-status" :class="booking.status">
              {{ getStatusLabel(booking.status) }}
            </div>
          </div>
          
          <div class="booking-content">
            <div class="booking-header">
              <h3 class="property-title">{{ booking.property?.title }}</h3>
              <div class="booking-price">{{ formatPrice(booking.total_price) }}</div>
            </div>
            
            <p class="property-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ booking.property?.address }}
            </p>
            
            <div class="booking-dates">
              <div class="date-group">
                <span class="date-label">Arrivée</span>
                <span class="date-value">{{ formatDate(booking.start_date) }}</span>
              </div>
              <div class="date-separator">→</div>
              <div class="date-group">
                <span class="date-label">Départ</span>
                <span class="date-value">{{ formatDate(booking.end_date) }}</span>
              </div>
            </div>
            
            <div class="booking-details">
              <div class="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>{{ getDurationInNights(booking.start_date, booking.end_date) }} {{ getDurationInNights(booking.start_date, booking.end_date) === 1 ? 'nuit' : 'nuits' }}</span>
              </div>
              <div class="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121L17 20zM9 6a3 3 0 106 0v1H9V6zM7 21h10a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>{{ booking.guests || 2 }} {{ (booking.guests || 2) === 1 ? 'voyageur' : 'voyageurs' }}</span>
              </div>
            </div>
            
            <div class="booking-actions">
              <router-link 
                :to="`/client/properties/${booking.property?.id}`" 
                class="action-btn secondary"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Voir la propriété
              </router-link>
              
              <button 
                v-if="booking.status === 'pending'"
                @click="cancelBooking(booking)" 
                class="action-btn danger"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Annuler
              </button>
              
              <button 
                v-if="booking.invoices && booking.invoices.length > 0"
                @click="downloadInvoice(booking.invoices[0])" 
                class="action-btn primary"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                </svg>
                Facture
              </button>
              
              <!-- Nouveau bouton pour générer une facture -->
              <button 
                @click="generateInvoice(booking)"
                class="action-btn invoice"
                title="Générer la facture"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                Générer facture
              </button>
              
              <button 
                v-if="canReview(booking)"
                @click="openReviewModal(booking)" 
                class="action-btn review"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
                Évaluer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'annulation -->
    <div v-if="showCancelModal" class="modal-overlay" @click="closeCancelModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Annuler la réservation</h3>
          <button @click="closeCancelModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="warning-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h4>Êtes-vous sûr de vouloir annuler cette réservation ?</h4>
          <p>
            <strong>{{ bookingToCancel?.property?.title }}</strong><br>
            Du {{ bookingToCancel?.start_date ? formatDate(bookingToCancel.start_date) : 'N/A' }} au {{ bookingToCancel?.end_date ? formatDate(bookingToCancel.end_date) : 'N/A' }}<br>
            Montant : {{ bookingToCancel?.total_price ? formatPrice(bookingToCancel.total_price) : 'N/A' }}
          </p>
          <p class="cancellation-policy">
            Selon notre politique d'annulation, vous pourrez être remboursé partiellement ou totalement selon les conditions.
          </p>
        </div>
        
        <div class="modal-actions">
          <button @click="closeCancelModal" class="btn secondary">Garder la réservation</button>
          <button @click="confirmCancellation" class="btn danger" :disabled="isCancelling">
            <span v-if="!isCancelling">Confirmer l'annulation</span>
            <div v-else class="btn-loading">
              <div class="spinner"></div>
              <span>Annulation...</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal d'évaluation -->
    <div v-if="showReviewModal" class="modal-overlay" @click="closeReviewModal">
      <div class="modal-content review-modal" @click.stop>
        <div class="modal-header">
          <h3>Évaluer votre séjour</h3>
          <button @click="closeReviewModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="property-info">
            <img 
              :src="getPropertyImageSrc(bookingToReview?.property?.images?.[0], bookingToReview?.property?.type) || '/placeholder-property.jpg'" 
              :alt="bookingToReview?.property?.title"
              @error="(e) => handleImageError(e, bookingToReview?.property?.type)"
            />
            <div>
              <h4>{{ bookingToReview?.property?.title }}</h4>
              <p>{{ bookingToReview?.start_date ? formatDate(bookingToReview.start_date) : 'N/A' }} - {{ bookingToReview?.end_date ? formatDate(bookingToReview.end_date) : 'N/A' }}</p>
            </div>
          </div>
          
          <div class="rating-section">
            <label>Note générale</label>
            <div class="rating-stars">
              <button
                v-for="i in 5"
                :key="i"
                @click="reviewForm.rating = i"
                :class="{ active: i <= reviewForm.rating }"
                class="rating-star"
              >
                ★
              </button>
            </div>
          </div>
          
          <div class="comment-section">
            <label>Votre avis (optionnel)</label>
            <textarea
              v-model="reviewForm.comment"
              placeholder="Partagez votre expérience..."
              class="comment-textarea"
              rows="4"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="closeReviewModal" class="btn secondary">Annuler</button>
          <button @click="submitReview" class="btn primary" :disabled="!reviewForm.rating || isSubmittingReview">
            <span v-if="!isSubmittingReview">Publier l'avis</span>
            <div v-else class="btn-loading">
              <div class="spinner"></div>
              <span>Publication...</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Composant de génération de facture -->
    <!-- <InvoiceGenerator 
      v-if="selectedBookingForInvoice"
      :booking="selectedBookingForInvoice"
      :show="showInvoiceModal"
      @close="closeInvoiceModal"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookingsStore, type Booking } from '../../stores/bookings'
// import InvoiceGenerator from '../../components/InvoiceGenerator.vue'

const bookingsStore = useBookingsStore()

// État local
const activeFilter = ref('all')
const showCancelModal = ref(false)
const showReviewModal = ref(false)
const showInvoiceModal = ref(false)
const bookingToCancel = ref<Booking | null>(null)
const bookingToReview = ref<Booking | null>(null)
const selectedBookingForInvoice = ref<Booking | null>(null)
const isCancelling = ref(false)
const isSubmittingReview = ref(false)

const reviewForm = ref({
  rating: 0,
  comment: ''
})

// Filtres de statut
const statusFilters = [
  { 
    value: 'all', 
    label: 'Toutes',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>'
  },
  { 
    value: 'pending', 
    label: 'En attente',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
  },
  { 
    value: 'confirmed', 
    label: 'Confirmées',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  },
  { 
    value: 'completed', 
    label: 'Terminées',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  },
  { 
    value: 'cancelled', 
    label: 'Annulées',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
  }
]

// Computed
const filteredBookings = computed(() => {
  if (activeFilter.value === 'all') {
    return bookingsStore.myBookings
  }
  return bookingsStore.myBookings.filter((booking: Booking) => booking.status === activeFilter.value)
})

const totalBookings = computed(() => bookingsStore.myBookings.length)

const upcomingBookings = computed(() => {
  const today = new Date()
  return bookingsStore.myBookings.filter((booking: Booking) => {
    const startDate = new Date(booking.start_date)
    return startDate > today && (booking.status === 'confirmed' || booking.status === 'pending')
  }).length
})

const totalSpent = computed(() => {
  return bookingsStore.myBookings
    .filter((booking: Booking) => booking.status === 'completed' || booking.status === 'confirmed')
    .reduce((sum: number, booking: Booking) => sum + booking.total_price, 0)
})

// Méthodes
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getDurationInNights = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    completed: 'Terminée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

const getBookingCountByStatus = (status: string) => {
  if (status === 'all') return bookingsStore.myBookings.length
  return bookingsStore.myBookings.filter((booking: Booking) => booking.status === status).length
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

const getPropertyImageSrc = (imagePath?: string, propertyType?: string) => {
  console.log('🖼️ BookingsView - Image path reçu:', imagePath)
  
  if (!imagePath) {
    console.log('🖼️ BookingsView - Pas d\'image fournie, utilisation de l\'image par défaut')
    return getDefaultImage(propertyType)
  }
  
  // Utiliser la fonction d'URL améliorée
  const imageUrl = getPropertyImageUrl(imagePath)
  console.log('🖼️ BookingsView - URL finale générée:', imageUrl)
  
  if (imageUrl) return imageUrl
  
  // Si pas d'URL générée, retourner l'image par défaut selon le type
  console.log('🖼️ BookingsView - Aucune URL générée, utilisation du type par défaut:', propertyType)
  return getDefaultImage(propertyType)
}

const cancelBooking = (booking: Booking) => {
  bookingToCancel.value = booking
  showCancelModal.value = true
}

const closeCancelModal = () => {
  showCancelModal.value = false
  bookingToCancel.value = null
}

const confirmCancellation = async () => {
  if (!bookingToCancel.value) return
  
  isCancelling.value = true
  
  try {
    const result = await bookingsStore.cancelBooking(bookingToCancel.value?.id ?? 0, 'Annulation demandée par le client')
    if (result.success) {
      closeCancelModal()
      // Notification de succès
      console.log('Réservation annulée avec succès')
    }
  } catch (error) {
    console.error('Erreur lors de l\'annulation:', error)
  } finally {
    isCancelling.value = false
  }
}

const downloadInvoice = (invoice: unknown) => {
  // Implémentation du téléchargement de facture
  console.log('Download invoice:', invoice)
}

// Nouvelle méthode pour générer une facture
const generateInvoice = (booking: Booking) => {
  selectedBookingForInvoice.value = booking
  showInvoiceModal.value = true
}

// const closeInvoiceModal = () => {
//   showInvoiceModal.value = false
//   selectedBookingForInvoice.value = null
// }

const canReview = (booking: Booking) => {
  return booking.status === 'completed'
}

const openReviewModal = (booking: Booking) => {
  bookingToReview.value = booking
  reviewForm.value = { rating: 0, comment: '' }
  showReviewModal.value = true
}

const closeReviewModal = () => {
  showReviewModal.value = false
  bookingToReview.value = null
  reviewForm.value = { rating: 0, comment: '' }
}

const submitReview = async () => {
  if (!bookingToReview.value || !reviewForm.value.rating) return
  
  isSubmittingReview.value = true
  
  try {
    // Ici, vous appelleriez l'API pour soumettre l'avis
    console.log('Submit review:', {
      booking_id: bookingToReview.value?.id ?? 0,
      rating: reviewForm.value.rating,
      comment: reviewForm.value.comment
    })
    
    closeReviewModal()
    // Marquer comme évalué
    if (bookingToReview.value) {
      // Note: reviewed property would need to be added to Booking interface
      console.log('Review submitted for booking:', bookingToReview.value?.id)
    }
  } catch (error) {
    console.error('Erreur lors de la soumission de l\'avis:', error)
  } finally {
    isSubmittingReview.value = false
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🔍 BookingsView - Chargement des réservations...')
  
  try {
    await bookingsStore.fetchMyBookings()
    console.log('✅ BookingsView - Réservations chargées:', bookingsStore.myBookings.length)
    
    // Debug des images des réservations
    bookingsStore.myBookings.forEach((booking: Booking, index: number) => {
      console.log(`📋 Réservation ${index + 1}:`, booking.property?.title)
      if (booking.property?.images) {
        console.log(`🖼️ Images trouvées:`, booking.property.images)
        console.log(`🔗 URL générée:`, getPropertyImageSrc(booking.property.images[0], booking.property.type))
      } else {
        console.log('❌ Aucune image pour cette réservation')
      }
    })
  } catch (error) {
    console.error('❌ Erreur lors du chargement des réservations:', error)
    
    // En cas d'erreur, créer des réservations de test
    console.log('🧪 Création de réservations de test...')
    
    // Simuler des réservations avec des propriétés
    const testBookings = [
      {
        id: 1,
        status: 'confirmed',
        start_date: '2024-02-15',
        end_date: '2024-02-18',
        total_price: 360,
        guests: 2,
        property: {
          id: 1,
          title: 'Appartement Moderne Test',
          type: 'apartment',
          images: ['/placeholder-property.svg']
        }
      },
      {
        id: 2,
        status: 'pending',
        start_date: '2024-03-01',
        end_date: '2024-03-05',
        total_price: 800,
        guests: 4,
        property: {
          id: 2,
          title: 'Maison avec Jardin Test',
          type: 'house',
          images: ['/placeholder-property.svg']
        }
      }
    ]
    
    // Ajouter les réservations de test au store (si possible)
    console.log('✅ Réservations de test créées:', testBookings.length)
  }
})
</script>

<style scoped>
@import url('../../assets/cyber-theme.css');
@import url('../../assets/ultra-modern-theme.css');

.bookings-view {
  min-height: 100vh;
  background: var(--bg-gradient-main);
  padding: 2rem;
}

.bookings-header {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-cyber);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.client-title {
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  text-shadow: 0 4px 12px rgba(67, 0, 255, 0.3) !important;
  position: relative;
}

.client-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #4300FF, #0065F8);
  border-radius: 2px;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: 2rem 1.5rem !important;
  background: var(--glass-bg-light) !important;
  border: 1px solid var(--glass-border) !important;
  border-radius: var(--radius-large) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  transition: all 0.3s ease;
}

.stat-item:nth-child(1)::before {
  background: linear-gradient(90deg, #6366F1, #3B82F6, #06B6D4);
}

.stat-item:nth-child(2)::before {
  background: linear-gradient(90deg, #3B82F6, #06B6D4);
}

.stat-item:nth-child(3)::before {
  background: linear-gradient(90deg, #06B6D4, #10B981);
}

.stat-item:hover {
  transform: translateY(-4px) scale(1.02) !important;
  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.15), 0 0 30px rgba(59, 130, 246, 0.1) !important;
  border-color: var(--primary-color) !important;
}

.stat-number {
  font-size: 2rem;
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.status-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  position: relative;
}

.status-filter-btn:hover {
  background: var(--glass-bg-medium);
  color: var(--text-primary);
}

.status-filter-btn.active {
  background: var(--primary-gradient);
  color: white;
  border-color: var(--electric-blue);
  box-shadow: var(--shadow-neon-blue);
}

/* Couleurs modernes pour les boutons de filtres */
.status-filter-btn:nth-child(1).active {
  background: linear-gradient(135deg, #6366F1 0%, #3B82F6 50%, #06B6D4 100%) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4), 0 0 20px rgba(59, 130, 246, 0.3) !important;
}

.status-filter-btn:nth-child(2).active {
  background: linear-gradient(135deg, #F59E0B 0%, #F97316 50%, #EF4444 100%) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4), 0 0 20px rgba(249, 115, 22, 0.3) !important;
}

.status-filter-btn:nth-child(3).active {
  background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.3) !important;
}

.status-filter-btn:nth-child(4).active {
  background: linear-gradient(135deg, #06B6D4 0%, #10B981 100%) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(6, 182, 212, 0.4), 0 0 20px rgba(16, 185, 129, 0.3) !important;
}

.status-filter-btn:nth-child(5).active {
  background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4), 0 0 20px rgba(168, 85, 247, 0.3) !important;
}

.filter-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.filter-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.filter-count {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 1.5rem;
  text-align: center;
}

.status-filter-btn.active .filter-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.bookings-section {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  box-shadow: var(--shadow-cyber);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
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
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
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
  font-size: 1.5rem;
}

.empty-state p {
  margin-bottom: 2rem;
  font-size: 1.125rem;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--primary-gradient);
  color: white;
  text-decoration: none;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  transition: var(--transition-smooth);
  box-shadow: var(--shadow-neon-blue);
}

.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-cyber);
}

.cta-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.booking-card {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  overflow: hidden;
  transition: var(--transition-smooth);
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  box-shadow: var(--shadow-card);
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.booking-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover);
}

.booking-card.pending {
  border-color: var(--solar-orange);
  background: rgba(255, 165, 0, 0.03);
}

.booking-card.confirmed {
  border-color: var(--electric-blue);
  background: rgba(0, 229, 255, 0.03);
}

.booking-card.completed {
  border-color: var(--acid-green);
  background: rgba(16, 185, 129, 0.03);
}

.booking-card.cancelled {
  border-color: var(--laser-red);
  background: rgba(255, 0, 64, 0.03);
  opacity: 0.7;
}

.booking-image {
  position: relative;
  height: 200px;
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

.booking-status {
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

.booking-status.pending {
  background: rgba(255, 165, 0, 0.2);
  color: var(--solar-orange);
  border: 1px solid rgba(255, 165, 0, 0.3);
}

.booking-status.confirmed {
  background: rgba(0, 229, 255, 0.2);
  color: var(--electric-blue);
  border: 1px solid rgba(0, 229, 255, 0.3);
}

.booking-status.completed {
  background: rgba(16, 185, 129, 0.2);
  color: var(--acid-green);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.booking-status.cancelled {
  background: rgba(255, 0, 64, 0.2);
  color: var(--laser-red);
  border: 1px solid rgba(255, 0, 64, 0.3);
}

.booking-content {
  padding: 2rem;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.property-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.booking-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--electric-blue);
  flex-shrink: 0;
}

.property-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.property-location svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  flex-shrink: 0;
}

.booking-dates {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
}

.date-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.date-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.date-separator {
  font-size: 1.25rem;
  color: var(--text-muted);
  font-weight: 600;
}

.booking-details {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
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

.booking-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-medium);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition-smooth);
  cursor: pointer;
  border: none;
  flex: 1;
  justify-content: center;
  min-width: 120px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #6366F1 0%, #3B82F6 50%, #06B6D4 100%) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3), 0 0 20px rgba(59, 130, 246, 0.2) !important;
  position: relative;
  overflow: hidden;
  font-weight: 700 !important;
}

.action-btn.primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.action-btn.primary:hover::before {
  left: 100%;
}

.action-btn.primary:hover {
  transform: translateY(-3px) scale(1.05) !important;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.5), 0 0 30px rgba(59, 130, 246, 0.3) !important;
  background: linear-gradient(135deg, #5B5BF5 0%, #3275F4 50%, #05A5C4 100%) !important;
}

.action-btn.secondary {
  background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3), 0 0 20px rgba(6, 182, 212, 0.2) !important;
  position: relative;
  overflow: hidden;
  font-weight: 700 !important;
}

.action-btn.secondary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.action-btn.secondary:hover::before {
  left: 100%;
}

.action-btn.secondary:hover {
  transform: translateY(-3px) scale(1.05) !important;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.5), 0 0 30px rgba(6, 182, 212, 0.3) !important;
  background: linear-gradient(135deg, #3275F4 0%, #05A5C4 100%) !important;
}

.action-btn.danger {
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3), 0 0 20px rgba(220, 38, 38, 0.2) !important;
  position: relative;
  overflow: hidden;
  font-weight: 700 !important;
}

.action-btn.danger::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.action-btn.danger:hover::before {
  left: 100%;
}

.action-btn.danger:hover {
  transform: translateY(-3px) scale(1.05) !important;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.5), 0 0 30px rgba(220, 38, 38, 0.3) !important;
  background: linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%) !important;
}

.action-btn.review {
  background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3), 0 0 20px rgba(168, 85, 247, 0.2) !important;
  position: relative;
  overflow: hidden;
  font-weight: 700 !important;
}

.action-btn.review::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.action-btn.review:hover::before {
  left: 100%;
}

.action-btn.review:hover {
  transform: translateY(-3px) scale(1.05) !important;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.5), 0 0 30px rgba(168, 85, 247, 0.3) !important;
  background: linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%) !important;
}

.action-btn.invoice {
  background: linear-gradient(135deg, #06B6D4 0%, #10B981 100%) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(6, 182, 212, 0.3), 0 0 20px rgba(16, 185, 129, 0.2) !important;
  position: relative;
  overflow: hidden;
  font-weight: 700 !important;
}

.action-btn.invoice::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.action-btn.invoice:hover::before {
  left: 100%;
}

.action-btn.invoice:hover {
  transform: translateY(-3px) scale(1.05) !important;
  box-shadow: 0 8px 24px rgba(6, 182, 212, 0.5), 0 0 30px rgba(16, 185, 129, 0.3) !important;
  background: linear-gradient(135deg, #05A5C4 0%, #0F9F7A 100%) !important;
}

.action-btn svg {
  width: 1.125rem;
  height: 1.125rem;
  stroke: currentColor;
  stroke-width: 2.5;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  position: relative;
  z-index: 1;
}

.action-btn:hover svg {
  transform: scale(1.1);
  stroke-width: 3;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Animations spécifiques pour chaque type de bouton */
.action-btn.primary:hover svg {
  animation: icon-bounce 0.6s ease-in-out;
}

.action-btn.secondary:hover svg {
  animation: icon-rotate 0.5s ease-in-out;
}

.action-btn.invoice:hover svg {
  animation: icon-pulse 0.8s ease-in-out;
}

.action-btn.review:hover svg {
  animation: icon-wiggle 0.7s ease-in-out;
}

.action-btn.danger:hover svg {
  animation: icon-shake 0.5s ease-in-out;
}

@keyframes icon-bounce {
  0%, 100% { transform: scale(1.1) translateY(0); }
  50% { transform: scale(1.2) translateY(-3px); }
}

@keyframes icon-rotate {
  0%, 100% { transform: scale(1.1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(15deg); }
}

@keyframes icon-pulse {
  0%, 100% { transform: scale(1.1); }
  50% { transform: scale(1.3); }
}

@keyframes icon-wiggle {
  0%, 100% { transform: scale(1.1) rotate(0deg); }
  25% { transform: scale(1.15) rotate(-5deg); }
  75% { transform: scale(1.15) rotate(5deg); }
}

@keyframes icon-shake {
  0%, 100% { transform: scale(1.1) translateX(0); }
  25% { transform: scale(1.15) translateX(-2px); }
  75% { transform: scale(1.15) translateX(2px); }
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

.review-modal {
  max-width: 600px;
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

.warning-icon {
  width: 4rem;
  height: 4rem;
  background: rgba(245, 158, 11, 0.1);
  border: 2px solid var(--solar-orange);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: var(--solar-orange);
}

.warning-icon svg {
  width: 2rem;
  height: 2rem;
  stroke: currentColor;
}

.modal-body h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.125rem;
  text-align: center;
}

.modal-body p {
  color: var(--text-secondary);
  line-height: 1.6;
  text-align: center;
  margin-bottom: 1rem;
}

.cancellation-policy {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
}

.property-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--glass-bg-light);
  border-radius: var(--border-radius-medium);
}

.property-info img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius-small);
}

.property-info h4 {
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.property-info p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.rating-section {
  margin-bottom: 2rem;
}

.rating-section label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.rating-stars {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.rating-star {
  font-size: 2rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.rating-star:hover,
.rating-star.active {
  color: #ffd700;
  transform: scale(1.1);
}

.comment-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.comment-textarea {
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

.comment-textarea:focus {
  outline: none;
  border-color: var(--electric-blue);
  background: var(--glass-bg-medium);
}

.comment-textarea::placeholder {
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.btn.primary {
  background: var(--primary-gradient);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-neon-blue);
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

.btn-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Animations de pulsation pour les boutons */
@keyframes button-pulse-primary {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3), 0 0 20px rgba(59, 130, 246, 0.2);
  }
  50% {
    box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5), 0 0 30px rgba(59, 130, 246, 0.4);
  }
}

@keyframes button-pulse-secondary {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3), 0 0 20px rgba(6, 182, 212, 0.2);
  }
  50% {
    box-shadow: 0 6px 24px rgba(59, 130, 246, 0.5), 0 0 30px rgba(6, 182, 212, 0.4);
  }
}

@keyframes button-pulse-invoice {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(6, 182, 212, 0.3), 0 0 20px rgba(16, 185, 129, 0.2);
  }
  50% {
    box-shadow: 0 6px 24px rgba(6, 182, 212, 0.5), 0 0 30px rgba(16, 185, 129, 0.4);
  }
}

@keyframes button-pulse-review {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3), 0 0 20px rgba(168, 85, 247, 0.2);
  }
  50% {
    box-shadow: 0 6px 24px rgba(139, 92, 246, 0.5), 0 0 30px rgba(168, 85, 247, 0.4);
  }
}

/* Application des animations de pulsation */
.action-btn.primary:not(:hover) {
  animation: button-pulse-primary 3s ease-in-out infinite;
}

.action-btn.secondary:not(:hover) {
  animation: button-pulse-secondary 3s ease-in-out infinite 1s;
}

.action-btn.invoice:not(:hover) {
  animation: button-pulse-invoice 3s ease-in-out infinite 2s;
}

.action-btn.review:not(:hover) {
  animation: button-pulse-review 3s ease-in-out infinite 1.5s;
}

/* Responsive */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .header-stats {
    justify-content: center;
  }
  
  .bookings-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
  
  .booking-actions {
    flex-direction: column;
  }
  
  .action-btn {
    flex: none;
  }
}

@media (max-width: 768px) {
  .bookings-view {
    padding: 1rem;
  }
  
  .bookings-header,
  .bookings-section {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .header-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .status-filters {
    flex-direction: column;
  }
  
  .bookings-grid {
    grid-template-columns: 1fr;
  }
  
  .booking-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .booking-dates {
    flex-direction: column;
    gap: 1rem;
  }
  
  .date-separator {
    transform: rotate(90deg);
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .rating-stars {
    gap: 1rem;
  }
  
  .rating-star {
    font-size: 2.5rem;
  }
}
</style>
