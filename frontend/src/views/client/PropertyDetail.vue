<template>
  <div class="property-detail">
    <div v-if="isLoading" class="loading-state">
      <div class="cyber-spinner"></div>
      <p>Chargement de la propriété...</p>
    </div>
    
    <div v-else-if="property" class="property-content">
      <!-- Galerie d'images -->
      <div class="image-gallery">
        <div class="main-image">
          <img 
            :src="currentImageSrc" 
            :alt="property.title"
            @error="(e) => handleImageError(e, property?.type)"
          />
          <div class="image-navigation">
            <button 
              @click="previousImage" 
              :disabled="currentImageIndex === 0"
              class="nav-btn prev"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button 
              @click="nextImage" 
              :disabled="currentImageIndex === (property.images?.length || 1) - 1"
              class="nav-btn next"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <div class="image-counter">
            {{ currentImageIndex + 1 }} / {{ property.images?.length || 1 }}
          </div>
        </div>
        
        <div v-if="property.images && property.images.length > 1" class="thumbnail-strip">
          <button
            v-for="(image, index) in property.images"
            :key="index"
            @click="currentImageIndex = index"
            :class="{ active: currentImageIndex === index }"
            class="thumbnail"
          >
            <img :src="getPropertyImageSrc(image, property.type)" :alt="`Image ${index + 1}`" @error="(e) => handleImageError(e, property?.type)" />
          </button>
        </div>
      </div>
      
      <!-- Informations principales -->
      <div class="property-info">
        <div class="property-header">
          <div class="header-left">
            <h1 class="property-title">{{ property.title }}</h1>
            <p class="property-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ property.address }}
            </p>
            <div class="property-badges">
              <span class="type-badge" :class="property.type">
                {{ getTypeLabel(property.type) }}
              </span>
              <span v-if="property.featured" class="featured-badge">
                ⭐ Coup de cœur
              </span>
            </div>
          </div>
          
          <div class="header-right">
            <div class="property-rating">
              <div class="stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= (property.rating || 0) }">★</span>
              </div>
              <span class="rating-text">({{ property.reviewsCount || 0 }} avis)</span>
            </div>
            <div class="property-price">
              <span class="price-amount">{{ formatPrice(property.price_per_night) }}</span>
              <span class="price-period">/ nuit</span>
            </div>
          </div>
        </div>
        
        <!-- Description -->
        <div class="property-description">
          <h2>Description</h2>
          <p>{{ property.description || 'Une propriété exceptionnelle avec tous les équipements modernes pour un séjour confortable et mémorable.' }}</p>
        </div>
        
        <!-- Caractéristiques -->
        <div class="property-features">
          <h2>Caractéristiques</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7"/>
                </svg>
              </div>
              <div class="feature-content">
                <span class="feature-value">{{ property.bedrooms }}</span>
                <span class="feature-label">{{ property.bedrooms > 1 ? 'Chambres' : 'Chambre' }}</span>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3a2 2 0 002 2h4a2 2 0 002-2v-3"/>
                </svg>
              </div>
              <div class="feature-content">
                <span class="feature-value">{{ property.bathrooms }}</span>
                <span class="feature-label">{{ property.bathrooms > 1 ? 'Salles de bain' : 'Salle de bain' }}</span>
              </div>
            </div>
            
            <div v-if="property.area" class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2M16 4h2a2 2 0 012 2v2M16 20h2a2 2 0 002-2v-2"/>
                </svg>
              </div>
              <div class="feature-content">
                <span class="feature-value">{{ property.area }}</span>
                <span class="feature-label">m²</span>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121L17 20zM9 6a3 3 0 106 0v1H9V6zM7 21h10a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="feature-content">
                <span class="feature-value">{{ property.guests || 4 }}</span>
                <span class="feature-label">Voyageurs</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Équipements -->
        <div class="property-amenities">
          <h2>Équipements</h2>
          <div class="amenities-grid">
            <div class="amenity-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1.42 9.007a16.997 16.997 0 0121.16 0m-18.34 2.993a12.996 12.996 0 0115.52 0M6.34 15.002a5.995 5.995 0 018.32 0l-2.44-2.44m-1.44 3.44v.01"/>
              </svg>
              <span>WiFi gratuit</span>
            </div>
            <div class="amenity-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="14" y="14" width="4" height="6" rx="2"/>
                <rect x="6" y="4" width="4" height="6" rx="2"/>
                <path d="M6 20h4"/>
                <path d="M14 10h4"/>
              </svg>
              <span>Parking inclus</span>
            </div>
            <div class="amenity-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              <span>Chauffage</span>
            </div>
            <div class="amenity-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              <span>Télévision</span>
            </div>
            <div class="amenity-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span>Cuisine équipée</span>
            </div>
            <div class="amenity-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
              <span>Climatisation</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Panneau de réservation -->
      <div class="booking-panel">
        <div class="booking-card">
          <div class="booking-header">
            <div class="booking-price">
              <span class="price-amount">{{ formatPrice(property.price_per_night) }}</span>
              <span class="price-period">/ nuit</span>
            </div>
            <div class="booking-rating">
              <div class="stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= (property.rating || 0) }">★</span>
              </div>
              <span class="rating-count">({{ property.reviewsCount || 0 }})</span>
            </div>
          </div>
          
          <form @submit.prevent="handleBooking" class="booking-form">
            <div class="date-inputs">
              <div class="date-group">
                <label>Arrivée</label>
                <input 
                  v-model="bookingForm.startDate" 
                  type="date" 
                  required 
                  :min="minDate"
                  class="date-input"
                />
              </div>
              <div class="date-group">
                <label>Départ</label>
                <input 
                  v-model="bookingForm.endDate" 
                  type="date" 
                  required 
                  :min="bookingForm.startDate || minDate"
                  class="date-input"
                />
              </div>
            </div>
            
            <div class="guests-input">
              <label>Voyageurs</label>
              <select v-model="bookingForm.guests" class="guests-select">
                <option v-for="i in 8" :key="i" :value="i">
                  {{ i }} {{ i === 1 ? 'voyageur' : 'voyageurs' }}
                </option>
              </select>
            </div>
            
            <div v-if="bookingForm.startDate && bookingForm.endDate" class="booking-summary">
              <div class="summary-row">
                <span>{{ formatPrice(property.price_per_night) }} × {{ numberOfNights }} {{ numberOfNights === 1 ? 'nuit' : 'nuits' }}</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="summary-row">
                <span>Frais de service</span>
                <span>{{ formatPrice(serviceFee) }}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>{{ formatPrice(total) }}</span>
              </div>
            </div>
            
            <button 
              type="submit" 
              :disabled="!canBook || isBooking"
              class="book-button ultra-modern-btn ultra-modern-btn-primary"
            >
              <span v-if="!isBooking">Réserver</span>
              <div v-else class="booking-loading">
                <div class="spinner"></div>
                <span>Réservation...</span>
              </div>
            </button>
          </form>
          
          <p class="booking-note">Vous ne serez pas débité pour le moment</p>
        </div>
      </div>
    </div>
    
    <div v-else class="error-state">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h3>Propriété introuvable</h3>
      <p>Cette propriété n'existe pas ou n'est plus disponible.</p>
      <router-link to="/client/properties" class="back-button">
        Retour aux propriétés
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertiesStore, type Property } from '../../stores/properties'
import { useBookingsStore } from '../../stores/bookings'

const route = useRoute()
const router = useRouter()
const propertiesStore = usePropertiesStore()
const bookingStore = useBookingsStore()

// État local
const isLoading = ref(true)
const currentImageIndex = ref(0)
const isBooking = ref(false)

const bookingForm = ref({
  startDate: '',
  endDate: '',
  guests: 2
})

const property = ref<Property | null>(null)

// Computed
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const numberOfNights = computed(() => {
  if (!bookingForm.value.startDate || !bookingForm.value.endDate) return 0
  const start = new Date(bookingForm.value.startDate)
  const end = new Date(bookingForm.value.endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
})

const subtotal = computed(() => {
  if (!property.value || numberOfNights.value === 0) return 0
  return property.value.price_per_night * numberOfNights.value
})

const serviceFee = computed(() => {
  return Math.round(subtotal.value * 0.1) // 10% de frais de service
})

const total = computed(() => {
  return subtotal.value + serviceFee.value
})

const canBook = computed(() => {
  return bookingForm.value.startDate && 
         bookingForm.value.endDate && 
         numberOfNights.value > 0 &&
         bookingForm.value.guests > 0
})

const currentImageSrc = computed(() => {
  if (!property.value?.images || property.value.images.length === 0) {
    console.log('🖼️ Computed: Aucune image, retour image par défaut')
    return getDefaultImage(property.value?.type)
  }
  
  const currentImage = property.value.images[currentImageIndex.value]
  console.log('🖼️ Computed: Image courante:', currentImage)
  
  const src = getPropertyImageSrc(currentImage, property.value.type)
  console.log('🖼️ Computed: URL finale:', src)
  
  return src || getDefaultImage(property.value?.type)
})

// Méthodes
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
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

const getPropertyImageSrc = (imagePath?: string, propertyType?: string) => {
  console.log('🖼️ Image path reçu:', imagePath)
  
  if (!imagePath) {
    console.log('🖼️ Pas d\'image fournie, utilisation de l\'image par défaut')
    return getDefaultImage(propertyType)
  }
  
  // Utiliser la fonction d'URL améliorée
  const imageUrl = getPropertyImageUrl(imagePath)
  console.log('🖼️ URL finale générée:', imageUrl)
  
  if (imageUrl) return imageUrl
  
  // Si pas d'URL générée, retourner l'image par défaut selon le type
  console.log('🖼️ Aucune URL générée, utilisation du type par défaut:', propertyType)
  return getDefaultImage(propertyType)
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (property.value?.images && currentImageIndex.value < property.value.images.length - 1) {
    currentImageIndex.value++
  }
}

const handleBooking = async () => {
  if (!canBook.value || !property.value) return
  
  isBooking.value = true
  
  try {
    const result = await bookingStore.createBooking({
      property_id: property.value.id,
      start_date: bookingForm.value.startDate,
      end_date: bookingForm.value.endDate,
      guests: bookingForm.value.guests,
      total_price: total.value
    })
    
    if (result.success) {
      router.push('/client/bookings')
    }
  } catch (error) {
    console.error('Erreur lors de la réservation:', error)
  } finally {
    isBooking.value = false
  }
}

// Lifecycle
onMounted(async () => {
  const propertyId = Number(route.params.id)
  console.log('🔍 PropertyDetail - ID de la propriété:', propertyId)
  
  try {
    console.log('📡 Chargement de la propriété...')
    await propertiesStore.fetchProperty(propertyId)
    property.value = propertiesStore.property
    
    console.log('🏠 Propriété chargée:', property.value)
    if (property.value?.images) {
      console.log('🖼️ Images de la propriété:', property.value.images)
      console.log('📊 Nombre d\'images:', property.value.images.length)
      property.value.images.forEach((img, index) => {
        console.log(`🖼️ Image ${index + 1}:`, img)
        console.log(`🔗 URL générée ${index + 1}:`, getPropertyImageSrc(img, property.value?.type))
      })
    } else {
      console.log('❌ Aucune image trouvée pour cette propriété')
    }
    
    // Si l'URL contient ?book=true, ouvrir automatiquement le panneau de réservation
    if (route.query.book === 'true') {
      console.log('📝 Formulaire de réservation activé')
      // Scroll vers le panneau de réservation
      setTimeout(() => {
        const bookingPanel = document.querySelector('.booking-panel')
        bookingPanel?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la propriété:', error)
    
    // En cas d'erreur, créer une propriété de test pour éviter un écran vide
    console.log('🧪 Création d\'une propriété de test...')
    property.value = {
      id: propertyId,
      title: 'Appartement Moderne Test',
      description: 'Un magnifique appartement moderne au cœur de la ville avec toutes les commodités nécessaires pour un séjour parfait.',
      type: 'apartment' as const,
      price_per_night: 120,
      address: '123 Rue de la République, Paris, France',
      bedrooms: 2,
      bathrooms: 1,
      area: 65,
      status: 'available' as const,
      manager_id: 1,
      images: [
        '/placeholder-property.svg',
        '/placeholder-property.svg'
      ],
      rating: 4.5,
      reviewsCount: 12,
      guests: 4,
      amenities: ['WiFi', 'Cuisine équipée', 'Climatisation', 'Parking'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    console.log('✅ Propriété de test créée:', property.value)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
@import url('../../assets/cyber-theme.css');
@import url('../../assets/ultra-modern-theme.css');

.property-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 50%, #E2E8F0 100%);
  padding: 2rem;
}

.loading-state,
.error-state {
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

.error-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  color: var(--laser-red);
}

.error-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.error-state h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.error-state p {
  margin-bottom: 2rem;
  font-size: 1.125rem;
}

.back-button {
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

.back-button:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-cyber);
}

.property-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

/* Galerie d'images */
.image-gallery {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  overflow: hidden;
  box-shadow: var(--shadow-cyber);
}

.main-image {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  opacity: 0;
  transition: var(--transition-smooth);
}

.main-image:hover .image-navigation {
  opacity: 1;
}

.nav-btn {
  width: 3rem;
  height: 3rem;
  background: var(--glass-bg-medium);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:not(:disabled):hover {
  background: var(--glass-bg-strong);
  transform: scale(1.1);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
}

.image-counter {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: var(--glass-bg-medium);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
}

.thumbnail-strip {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  background: var(--glass-bg-light);
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: var(--border-radius-small);
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.thumbnail.active {
  border-color: var(--electric-blue);
  box-shadow: var(--shadow-neon-blue);
}

.thumbnail:hover {
  transform: scale(1.05);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Informations de la propriété */
.property-info {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  box-shadow: var(--shadow-cyber);
  height: fit-content;
}

.property-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.property-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.property-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.property-location svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.property-badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.type-badge {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-small);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.type-badge.house {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.type-badge.apartment {
  background: rgba(16, 185, 129, 0.1);
  color: var(--acid-green);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.type-badge.office {
  background: rgba(245, 158, 11, 0.1);
  color: var(--solar-orange);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.featured-badge {
  padding: 0.5rem 1rem;
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: var(--border-radius-small);
  font-size: 0.875rem;
  font-weight: 600;
  animation: featured-glow 2s ease-in-out infinite alternate;
}

@keyframes featured-glow {
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
}

.header-right {
  text-align: right;
  flex-shrink: 0;
}

.property-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  display: flex;
  gap: 0.125rem;
}

.star {
  font-size: 1.25rem;
  color: #666;
}

.star.filled {
  color: #ffd700;
}

.rating-text {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.property-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.price-amount {
  font-size: 2rem;
  font-weight: 700;
  color: var(--electric-blue);
}

.price-period {
  font-size: 1rem;
  color: var(--text-muted);
}

.property-description,
.property-features,
.property-amenities {
  margin-bottom: 2rem;
}

.property-description h2,
.property-features h2,
.property-amenities h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.property-description p {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 1.125rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  transition: var(--transition-smooth);
}

.feature-item:hover {
  background: var(--glass-bg-medium);
  transform: translateY(-2px);
}

.feature-icon {
  width: 3rem;
  height: 3rem;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: white;
}

.feature-content {
  display: flex;
  flex-direction: column;
}

.feature-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.feature-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  transition: var(--transition-smooth);
}

.amenity-item:hover {
  background: var(--glass-bg-medium);
}

.amenity-item svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: var(--electric-blue);
  flex-shrink: 0;
}

.amenity-item span {
  color: var(--text-secondary);
  font-weight: 500;
}

/* Panneau de réservation */
.booking-panel {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.booking-card {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 2rem;
  box-shadow: var(--shadow-cyber);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--glass-border);
}

.booking-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.booking-price .price-amount {
  font-size: 2rem;
  font-weight: 700;
  color: var(--electric-blue);
}

.booking-price .price-period {
  font-size: 1rem;
  color: var(--text-muted);
}

.booking-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-count {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.date-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-input {
  padding: 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition-smooth);
}

.date-input:focus {
  outline: none;
  border-color: var(--electric-blue);
  background: var(--glass-bg-medium);
}

.guests-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.guests-input label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.guests-select {
  padding: 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition-smooth);
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.guests-select:focus {
  outline: none;
  border-color: var(--electric-blue);
  background-color: var(--glass-bg-medium);
}

.booking-summary {
  padding: 1.5rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
}

.summary-row.total {
  padding-top: 1rem;
  border-top: 1px solid var(--glass-border);
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.125rem;
}

.book-button {
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%) !important;
  color: white !important;
  border: none !important;
  border-radius: var(--border-radius-medium);
  font-weight: 700;
  font-size: 1.125rem;
  cursor: pointer;
  transition: var(--transition-smooth);
  box-shadow: 0 6px 25px rgba(67, 0, 255, 0.4) !important;
}

.book-button:not(:disabled):hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 10px 35px rgba(67, 0, 255, 0.6) !important;
  filter: brightness(1.1) !important;
}

.book-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.booking-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.booking-note {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #64748B !important;
}

/* Override styles for better contrast */
.property-info,
.booking-card {
  background: white !important;
  border: 2px solid rgba(67, 0, 255, 0.2) !important;
  box-shadow: 0 8px 32px rgba(67, 0, 255, 0.15) !important;
}

.property-title {
  color: #1E293B !important;
}

.property-address,
.property-description {
  color: #475569 !important;
}

.feature-item {
  color: #64748B !important;
}

.form-group label {
  color: #374151 !important;
  font-weight: 600;
}

.form-control {
  background: rgba(248, 250, 252, 0.95) !important;
  border: 2px solid rgba(67, 0, 255, 0.3) !important;
  color: #1E293B !important;
}

.form-control:focus {
  border-color: #0065F8 !important;
  box-shadow: 0 0 0 3px rgba(67, 0, 255, 0.1) !important;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .property-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .property-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-right {
    text-align: left;
    width: 100%;
  }
  
  .property-rating {
    align-items: flex-start;
  }
  
  .property-price {
    align-items: flex-start;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .amenities-grid {
    grid-template-columns: 1fr;
  }
  
  .booking-panel {
    position: static;
  }
  
  .date-inputs {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .property-detail {
    padding: 1rem;
  }
  
  .property-info,
  .booking-card {
    padding: 1.5rem;
  }
  
  .property-title {
    font-size: 2rem;
  }
  
  .main-image {
    height: 300px;
  }
  
  .property-badges {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .booking-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
