<template>
  <div class="bookings-overview-view">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Aperçu des Réservations</h1>
          <p>Vue d'ensemble de toutes les réservations de la plateforme</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" @click="refreshData">
            <span class="icon">🔄</span>
            Actualiser
          </button>
          <button class="btn btn-secondary" @click="exportData">
            <span class="icon">📊</span>
            Exporter
          </button>
        </div>
      </div>

      <!-- Statistiques globales -->
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">Total Réservations</div>
          </div>
        </div>
        <div class="stat-card confirmed">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.confirmed }}</div>
            <div class="stat-label">Confirmées</div>
          </div>
        </div>
        <div class="stat-card pending">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.pending }}</div>
            <div class="stat-label">En Attente</div>
          </div>
        </div>
        <div class="stat-card revenue">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <div class="stat-value">{{ formatCurrency(stats.totalRevenue) }}</div>
            <div class="stat-label">Revenus Totaux</div>
          </div>
        </div>
      </div>

      <!-- Filtres et recherche -->
      <div class="filters-section">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par client, propriété, référence..."
            class="search-input"
          >
        </div>
        <div class="filters">
          <select v-model="selectedStatus" class="filter-select">
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="cancelled">Annulée</option>
            <option value="completed">Terminée</option>
          </select>
          <select v-model="selectedPeriod" class="filter-select">
            <option value="">Toutes les périodes</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
          <input 
            v-model="selectedDateRange.start"
            type="date"
            class="filter-date"
            placeholder="Date début"
          >
          <input 
            v-model="selectedDateRange.end"
            type="date"
            class="filter-date"
            placeholder="Date fin"
          >
          <button class="btn btn-secondary" @click="resetFilters">
            <span class="icon">🗑️</span>
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Graphiques et analyses -->
      <div class="analytics-section">
        <div class="chart-card">
          <div class="chart-header">
            <h3>Évolution des Réservations</h3>
            <select v-model="chartPeriod" class="chart-period">
              <option value="week">7 derniers jours</option>
              <option value="month">30 derniers jours</option>
              <option value="year">12 derniers mois</option>
            </select>
          </div>
          <div class="chart-content">
            <div class="line-chart">
              <div class="chart-grid">
                <div 
                  v-for="point in chartData" 
                  :key="point.date"
                  class="chart-point"
                  :style="{ 
                    left: `${point.x}%`, 
                    bottom: `${point.y}%` 
                  }"
                  :title="`${point.date}: ${point.value} réservations`"
                ></div>
                <svg class="chart-line" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline 
                    :points="chartPoints"
                    fill="none"
                    stroke="var(--electric-blue)"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div class="chart-labels">
                <div 
                  v-for="label in chartLabels" 
                  :key="label"
                  class="chart-label"
                >
                  {{ label }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3>Répartition par Statut</h3>
          </div>
          <div class="chart-content">
            <div class="donut-chart">
              <div class="donut-stats">
                <div v-for="status in statusDistribution" :key="status.name" class="status-item">
                  <div :class="['status-color', status.name]"></div>
                  <span class="status-label">{{ getStatusLabel(status.name) }}</span>
                  <span class="status-value">{{ status.count }} ({{ status.percentage }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3>Top Propriétés Réservées</h3>
          </div>
          <div class="chart-content">
            <div class="top-properties">
              <div 
                v-for="property in topProperties" 
                :key="property.id"
                class="property-item"
              >
                <div class="property-info">
                  <div class="property-image">
                    <img 
                      v-if="property.image" 
                      :src="property.image" 
                      :alt="property.title"
                    >
                    <div v-else class="image-placeholder">🏠</div>
                  </div>
                  <div class="property-details">
                    <div class="property-title">{{ property.title }}</div>
                    <div class="property-location">{{ property.city }}</div>
                  </div>
                </div>
                <div class="property-metrics">
                  <div class="metric">
                    <span class="metric-value">{{ property.bookings }}</span>
                    <span class="metric-label">Réservations</span>
                  </div>
                  <div class="metric">
                    <span class="metric-value">{{ formatCurrency(property.revenue) }}</span>
                    <span class="metric-label">Revenus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table des réservations -->
      <div class="bookings-table-container">
        <div class="table-header">
          <h3>Liste des Réservations</h3>
          <div class="table-actions">
            <select v-model="itemsPerPage" class="items-per-page">
              <option value="10">10 par page</option>
              <option value="25">25 par page</option>
              <option value="50">50 par page</option>
            </select>
          </div>
        </div>
        
        <table class="bookings-table">
          <thead>
            <tr>
              <th @click="sortBy('reference')" class="sortable">
                Référence
                <span class="sort-icon">{{ getSortIcon('reference') }}</span>
              </th>
              <th>Client</th>
              <th>Propriété</th>
              <th @click="sortBy('start_date')" class="sortable">
                Dates
                <span class="sort-icon">{{ getSortIcon('start_date') }}</span>
              </th>
              <th @click="sortBy('total_price')" class="sortable">
                Total
                <span class="sort-icon">{{ getSortIcon('total_price') }}</span>
              </th>
              <th>Statut</th>
              <th @click="sortBy('created_at')" class="sortable">
                Créée le
                <span class="sort-icon">{{ getSortIcon('created_at') }}</span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in paginatedBookings" :key="booking.id">
              <td>
                <span class="booking-reference">#{{ booking.reference || booking.id }}</span>
              </td>
              <td>
                <div class="client-info">
                  <div class="client-avatar">
                    <img 
                      v-if="booking.client_avatar" 
                      :src="booking.client_avatar" 
                      :alt="booking.client_name || booking.client?.name"
                    >
                    <div v-else class="avatar-placeholder">
                      {{ getInitials(booking.client_name || booking.client?.name || 'N/A') }}
                    </div>
                  </div>
                  <div class="client-details">
                    <div class="client-name">{{ booking.client_name || booking.client?.name || 'Client inconnu' }}</div>
                    <div class="client-email">{{ booking.client_email || booking.client?.email || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="property-info">
                  <div class="property-image">
                    <img 
                      v-if="booking.property_image || booking.property?.images?.[0]" 
                      :src="booking.property_image || booking.property?.images?.[0]" 
                      :alt="booking.property_title || booking.property?.title"
                    >
                    <div v-else class="image-placeholder">🏠</div>
                  </div>
                  <div class="property-details">
                    <div class="property-title">{{ booking.property_title || booking.property?.title || 'Propriété inconnue' }}</div>
                    <div class="property-address">{{ booking.property_address || booking.property?.address || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="booking-dates">
                  <div class="check-in">
                    <span class="date-label">Arrivée:</span>
                    <span class="date-value">{{ formatDate(booking.start_date) }}</span>
                  </div>
                  <div class="check-out">
                    <span class="date-label">Départ:</span>
                    <span class="date-value">{{ formatDate(booking.end_date) }}</span>
                  </div>
                  <div class="duration">{{ booking.duration || Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24)) }} nuits</div>
                </div>
              </td>
              <td>
                <span class="booking-total">{{ formatCurrency(booking.total_price) }}</span>
              </td>
              <td>
                <span :class="['status-badge', booking.status]">
                  <span class="icon">{{ getStatusIcon(booking.status) }}</span>
                  {{ getStatusLabel(booking.status) }}
                </span>
              </td>
              <td>
                <span class="created-date">{{ formatDate(booking.created_at) }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="action-btn view"
                    @click="viewBooking(booking)"
                    title="Voir les détails"
                  >
                    <span class="icon">👁️</span>
                  </button>
                  <button 
                    v-if="booking.status === 'pending'"
                    class="action-btn confirm"
                    @click="confirmBooking(booking)"
                    title="Confirmer"
                  >
                    <span class="icon">✅</span>
                  </button>
                  <button 
                    v-if="booking.status !== 'cancelled'"
                    class="action-btn cancel"
                    @click="cancelBooking(booking)"
                    title="Annuler"
                  >
                    <span class="icon">❌</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Message si aucune réservation -->
        <div v-if="filteredBookings.length === 0" class="no-bookings">
          <span class="icon">📋</span>
          <h3>Aucune réservation trouvée</h3>
          <p>Essayez de modifier vos critères de recherche</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="pagination-btn"
          @click="currentPage = 1"
          :disabled="currentPage === 1"
        >
          <span class="icon">⏮️</span>
        </button>
        <button 
          class="pagination-btn"
          @click="currentPage--"
          :disabled="currentPage === 1"
        >
          <span class="icon">⏪</span>
        </button>
        
        <span class="pagination-info">
          Page {{ currentPage }} sur {{ totalPages }}
        </span>
        
        <button 
          class="pagination-btn"
          @click="currentPage++"
          :disabled="currentPage === totalPages"
        >
          <span class="icon">⏩</span>
        </button>
        <button 
          class="pagination-btn"
          @click="currentPage = totalPages"
          :disabled="currentPage === totalPages"
        >
          <span class="icon">⏭️</span>
        </button>
      </div>
    </div>

    <!-- Modal Détails Réservation -->
    <div v-if="showBookingDetails" class="modal-overlay" @click="showBookingDetails = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Détails de la réservation #{{ selectedBooking?.reference || selectedBooking?.id }}</h3>
          <button class="modal-close" @click="showBookingDetails = false">
            <span class="icon">❌</span>
          </button>
        </div>
        <div class="modal-body" v-if="selectedBooking">
          <div class="booking-details-grid">
            <div class="detail-section">
              <h4>Informations client</h4>
              <div class="detail-item">
                <label>Nom:</label>
                <span>{{ selectedBooking.client_name || selectedBooking.client?.name || 'Client inconnu' }}</span>
              </div>
              <div class="detail-item">
                <label>Email:</label>
                <span>{{ selectedBooking.client_email || selectedBooking.client?.email || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <label>Téléphone:</label>
                <span>{{ selectedBooking.client_phone || selectedBooking.client?.phone || 'Non renseigné' }}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>Informations propriété</h4>
              <div class="detail-item">
                <label>Propriété:</label>
                <span>{{ selectedBooking.property_title || selectedBooking.property?.title || 'Propriété inconnue' }}</span>
              </div>
              <div class="detail-item">
                <label>Adresse:</label>
                <span>{{ selectedBooking.property_address || selectedBooking.property?.address || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <label>Manager:</label>
                <span>{{ selectedBooking.manager_name || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section full-width">
            <h4>Détails de la réservation</h4>
            <div class="booking-info-grid">
              <div class="detail-item">
                <label>Référence:</label>
                <span>#{{ selectedBooking.reference || selectedBooking.id }}</span>
              </div>
              <div class="detail-item">
                <label>Date d'arrivée:</label>
                <span>{{ formatDate(selectedBooking.start_date) }}</span>
              </div>
              <div class="detail-item">
                <label>Date de départ:</label>
                <span>{{ formatDate(selectedBooking.end_date) }}</span>
              </div>
              <div class="detail-item">
                <label>Durée:</label>
                <span>{{ selectedBooking.duration || Math.ceil((new Date(selectedBooking.end_date).getTime() - new Date(selectedBooking.start_date).getTime()) / (1000 * 60 * 60 * 24)) }} nuits</span>
              </div>
              <div class="detail-item">
                <label>Nombre d'invités:</label>
                <span>{{ selectedBooking.guests }} personnes</span>
              </div>
              <div class="detail-item">
                <label>Prix total:</label>
                <span class="price-highlight">{{ formatCurrency(selectedBooking.total_price) }}</span>
              </div>
              <div class="detail-item">
                <label>Statut:</label>
                <span :class="['status-badge', selectedBooking.status]">
                  {{ getStatusLabel(selectedBooking.status) }}
                </span>
              </div>
              <div class="detail-item">
                <label>Créée le:</label>
                <span>{{ formatDate(selectedBooking.created_at) }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section full-width" v-if="selectedBooking.special_requests">
            <h4>Demandes spéciales</h4>
            <p class="special-requests">{{ selectedBooking.special_requests }}</p>
          </div>

          <div class="booking-actions">
            <button 
              v-if="selectedBooking.status === 'pending'"
              class="btn btn-success"
              @click="confirmBooking(selectedBooking)"
            >
              <span class="icon">✅</span>
              Confirmer
            </button>
            <button 
              v-if="selectedBooking.status !== 'cancelled'"
              class="btn btn-danger"
              @click="cancelBooking(selectedBooking)"
            >
              <span class="icon">❌</span>
              Annuler
            </button>
            <button class="btn btn-secondary" @click="exportBooking(selectedBooking)">
              <span class="icon">📄</span>
              Exporter PDF
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useBookingsStore } from '../../stores/bookings'
import type { Booking } from '../../stores/bookings'

// Interface pour les statistiques des propriétés
interface PropertyStats {
  id: number
  title: string
  city: string
  image: string | null
  bookings: number
  revenue: number
}

// Initialiser le store
const bookingsStore = useBookingsStore()

// État réactif
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPeriod = ref('')
const selectedDateRange = reactive({
  start: '',
  end: ''
})
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortField = ref('created_at')
const sortDirection = ref('desc')
const chartPeriod = ref('month')

// Modals
const showBookingDetails = ref(false)
const selectedBooking = ref<Booking | null>(null)

// Utiliser les données du store
const bookings = computed(() => bookingsStore.allBookings)
const loading = computed(() => bookingsStore.isLoading)

// Computed properties utilisant le store
const stats = computed(() => bookingsStore.adminStats)
const statusDistribution = computed(() => bookingsStore.statusDistribution)

const topProperties = computed(() => {
  const propertyStats = bookings.value.reduce((acc, booking) => {
    const propertyId = booking.property_id
    if (!acc[propertyId]) {
      acc[propertyId] = {
        id: propertyId,
        title: booking.property_title || booking.property?.title || 'Propriété inconnue',
        city: (booking.property_address || booking.property?.address || '').split(',').pop()?.trim() || '',
        image: booking.property_image || booking.property?.images?.[0] || null,
        bookings: 0,
        revenue: 0
      }
    }
    
    acc[propertyId].bookings++
    if (booking.status === 'confirmed' || booking.status === 'completed') {
      acc[propertyId].revenue += booking.total_price
    }
    
    return acc
  }, {} as Record<number, PropertyStats>)

  return Object.values(propertyStats)
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5)
})

const chartData = computed(() => {
  // Données simulées pour le graphique
  const data = [
    { date: '15/01', value: 5, x: 10, y: 30 },
    { date: '20/01', value: 8, x: 25, y: 48 },
    { date: '25/01', value: 12, x: 40, y: 72 },
    { date: '30/01', value: 7, x: 55, y: 42 },
    { date: '05/02', value: 15, x: 70, y: 90 },
    { date: '10/02', value: 10, x: 85, y: 60 }
  ]
  return data
})

const chartPoints = computed(() => {
  return chartData.value.map(point => `${point.x},${100 - point.y}`).join(' ')
})

const chartLabels = computed(() => {
  return chartData.value.map(point => point.date)
})

const filteredBookings = computed(() => {
  let filtered = bookings.value

  // Recherche par texte
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(booking => 
      (booking.reference || booking.id.toString()).toLowerCase().includes(query) ||
      (booking.client_name || booking.client?.name || '').toLowerCase().includes(query) ||
      (booking.property_title || booking.property?.title || '').toLowerCase().includes(query) ||
      (booking.client_email || booking.client?.email || '').toLowerCase().includes(query)
    )
  }

  // Filtre par statut
  if (selectedStatus.value) {
    filtered = filtered.filter(booking => booking.status === selectedStatus.value)
  }

  // Filtre par période (implémentation basique)
  if (selectedPeriod.value) {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    
    filtered = filtered.filter(booking => {
      const bookingDate = booking.created_at.split('T')[0]
      switch (selectedPeriod.value) {
        case 'today':
          return bookingDate === today
        case 'week':
          // Logique pour la semaine
          return true
        case 'month':
          // Logique pour le mois
          return true
        case 'year':
          // Logique pour l'année
          return true
        default:
          return true
      }
    })
  }

  // Filtre par plage de dates
  if (selectedDateRange.start && selectedDateRange.end) {
    filtered = filtered.filter(booking => {
      const bookingDate = booking.created_at.split('T')[0]
      return bookingDate >= selectedDateRange.start && bookingDate <= selectedDateRange.end
    })
  }

  // Tri
  filtered.sort((a, b) => {
    const aValue = (a as Record<string, unknown>)[sortField.value]
    const bValue = (b as Record<string, unknown>)[sortField.value]
    
    // Conversion sécurisée des valeurs pour la comparaison
    const aVal = typeof aValue === 'string' || typeof aValue === 'number' ? aValue : String(aValue)
    const bVal = typeof bValue === 'string' || typeof bValue === 'number' ? bValue : String(bValue)
    
    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return filtered
})

const paginatedBookings = computed(() => {
  // Si on utilise la pagination côté serveur, on retourne directement les bookings
  // Sinon on fait la pagination côté client pour les filtres locaux
  if (searchQuery.value || selectedStatus.value || selectedPeriod.value || selectedDateRange.start || selectedDateRange.end) {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredBookings.value.slice(start, end)
  }
  return bookings.value
})

const totalPages = computed(() => {
  // Si on utilise la pagination côté serveur
  if (!searchQuery.value && !selectedStatus.value && !selectedPeriod.value && !selectedDateRange.start && !selectedDateRange.end) {
    return bookingsStore.pagination.last_page
  }
  // Sinon pagination côté client
  return Math.ceil(filteredBookings.value.length / itemsPerPage.value)
})

// Méthodes
const refreshData = async () => {
  await loadBookings()
}

const loadBookings = async () => {
  const filters: Record<string, string> = {}
  
  if (selectedStatus.value) filters.status = selectedStatus.value
  if (selectedPeriod.value) filters.period = selectedPeriod.value
  if (selectedDateRange.start) filters.start_date = selectedDateRange.start
  if (selectedDateRange.end) filters.end_date = selectedDateRange.end
  if (searchQuery.value) filters.search = searchQuery.value
  
  const result = await bookingsStore.fetchAllBookings(currentPage.value, filters)
  if (!result.success && result.error) {
    console.error('Erreur lors du chargement des réservations:', result.error)
  }
}

const exportData = () => {
  console.log('Export des réservations en cours...')
  // Ici on pourrait générer un CSV ou Excel
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedPeriod.value = ''
  selectedDateRange.start = ''
  selectedDateRange.end = ''
  currentPage.value = 1
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getSortIcon = (field: string) => {
  if (sortField.value !== field) return '↕️'
  return sortDirection.value === 'asc' ? '↑' : '↓'
}

const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase()
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return '⏳'
    case 'confirmed': return '✅'
    case 'cancelled': return '❌'
    case 'completed': return '🏁'
    default: return '❓'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'En attente'
    case 'confirmed': return 'Confirmée'
    case 'cancelled': return 'Annulée'
    case 'completed': return 'Terminée'
    default: return 'Inconnu'
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewBooking = (booking: Booking) => {
  selectedBooking.value = booking
  showBookingDetails.value = true
}

const confirmBooking = async (booking: Booking) => {
  const result = await bookingsStore.confirmBooking(booking.id)
  if (result.success) {
    console.log('Réservation confirmée:', booking.reference)
    showBookingDetails.value = false
    await loadBookings() // Recharger les données
  } else {
    console.error('Erreur lors de la confirmation:', result.error)
    alert(result.error || 'Erreur lors de la confirmation de la réservation')
  }
}

const cancelBooking = async (booking: Booking) => {
  const reason = prompt(`Pourquoi annuler la réservation ${booking.reference || booking.id} ?`)
  if (reason !== null) {
    const result = await bookingsStore.cancelBooking(booking.id, reason)
    if (result.success) {
      console.log('Réservation annulée:', booking.reference)
      showBookingDetails.value = false
      await loadBookings() // Recharger les données
    } else {
      console.error('Erreur lors de l\'annulation:', result.error)
      alert(result.error || 'Erreur lors de l\'annulation de la réservation')
    }
  }
}

const exportBooking = (booking: Booking) => {
  console.log('Export PDF de la réservation:', booking.reference)
  // Ici on pourrait générer un PDF
}

// Watchers pour recharger automatiquement lors des changements de filtres
watch([searchQuery, selectedStatus, selectedPeriod, selectedDateRange], async () => {
  currentPage.value = 1
  await loadBookings()
}, { deep: true })

watch(currentPage, async () => {
  await loadBookings()
})

// Lifecycle
onMounted(async () => {
  // Charger les données initiales
  await loadBookings()
})
</script>

<style scoped>
/* Réutilisation des styles du PropertiesOverview avec adaptations pour BookingsOverview */
.bookings-overview-view {
  min-height: 100vh;
  background: var(--bg-gradient-main);
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem 2rem;
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
}

.header-content h1 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 700;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-content p {
  margin: 0.5rem 0 0 0;
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-card.total .stat-icon {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
}

.stat-card.confirmed .stat-icon {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
}

.stat-card.pending .stat-icon {
  background: rgba(251, 191, 36, 0.1);
  color: var(--warning-color);
}

.stat-card.revenue .stat-icon {
  background: rgba(168, 85, 247, 0.1);
  color: #A855F7;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Filtres */
.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid var(--input-border);
  border-radius: var(--border-radius-medium);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--electric-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select,
.filter-date {
  padding: 0.75rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: var(--border-radius-medium);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  min-width: 150px;
}

/* Charts */
.analytics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.chart-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--card-border);
  background: var(--bg-gray-50);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.chart-period {
  padding: 0.5rem 1rem;
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-small);
  background: var(--input-bg);
  color: var(--text-primary);
}

.chart-content {
  padding: 2rem;
}

/* Line chart */
.line-chart {
  height: 200px;
  position: relative;
}

.chart-grid {
  position: relative;
  height: 80%;
  border-bottom: 2px solid var(--card-border);
  border-left: 2px solid var(--card-border);
}

.chart-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--electric-blue);
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: var(--shadow-neon);
  z-index: 2;
}

.chart-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
}

.chart-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Donut chart */
.donut-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.status-color.pending {
  background: var(--warning-color);
}

.status-color.confirmed {
  background: var(--success-color);
}

.status-color.cancelled {
  background: var(--danger-color);
}

.status-color.completed {
  background: var(--electric-blue);
}

.status-label {
  flex: 1;
  color: var(--text-primary);
  font-weight: 500;
}

.status-value {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Top properties */
.top-properties {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.property-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-gray-50);
  border-radius: var(--border-radius-medium);
}

.property-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.property-image {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  border: 2px solid var(--card-border);
}

.property-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: var(--bg-gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.property-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.property-title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.property-location {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.property-metrics {
  display: flex;
  gap: 1rem;
}

.metric {
  text-align: center;
}

.metric-value {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.metric-label {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

/* Table */
.bookings-table-container {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  margin-bottom: 2rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--card-border);
  background: var(--bg-gray-50);
}

.table-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.items-per-page {
  padding: 0.5rem 1rem;
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-small);
  background: var(--input-bg);
  color: var(--text-primary);
}

.bookings-table {
  width: 100%;
  border-collapse: collapse;
}

.bookings-table th,
.bookings-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--card-border);
}

.bookings-table th {
  background: var(--bg-gray-50);
  color: var(--text-primary);
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.sortable:hover {
  background: var(--bg-gray-100);
}

.sort-icon {
  margin-left: 0.5rem;
  opacity: 0.6;
}

.bookings-table tr:hover {
  background: var(--bg-gray-50);
}

/* Booking info */
.booking-reference {
  font-family: monospace;
  font-weight: 600;
  color: var(--electric-blue);
  background: rgba(59, 130, 246, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-small);
}

.client-info,
.property-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.client-avatar,
.property-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--card-border);
}

.property-image {
  border-radius: var(--border-radius-small);
}

.client-avatar img,
.property-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--electric-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.client-details,
.property-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.client-name,
.property-title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.client-email,
.property-address {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Booking dates */
.booking-dates {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.check-in,
.check-out {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  min-width: 60px;
}

.date-value {
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 500;
}

.duration {
  font-size: 0.8rem;
  color: var(--electric-blue);
  font-weight: 600;
  text-align: center;
  padding: 0.25rem 0.5rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: var(--border-radius-small);
}

/* Booking total */
.booking-total {
  font-weight: 700;
  color: var(--electric-blue);
  font-size: 1.1rem;
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.pending {
  background: rgba(251, 191, 36, 0.1);
  color: var(--warning-color);
}

.status-badge.confirmed {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.status-badge.completed {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
}

/* Created date */
.created-date {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Actions */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--border-radius-small);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-btn.view {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
}

.action-btn.confirm {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
}

.action-btn.cancel {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.action-btn:hover {
  transform: scale(1.1);
  opacity: 0.8;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--card-border);
  background: var(--card-bg);
  color: var(--text-primary);
  border-radius: var(--border-radius-small);
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--electric-blue);
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--text-secondary);
  font-weight: 600;
}

/* No bookings */
.no-bookings {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.no-bookings .icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
  opacity: 0.5;
}

.no-bookings h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.no-bookings p {
  margin: 0;
}

/* Boutons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-medium);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-neon);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-neon-hover);
}

.btn-secondary {
  background: var(--bg-gray-200);
  color: var(--text-primary);
  border: 1px solid var(--card-border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-gray-300);
}

.btn-success {
  background: var(--gradient-success);
  color: white;
}

.btn-danger {
  background: var(--gradient-danger);
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 900px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--card-border);
}

.modal-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius-small);
}

.modal-close:hover {
  background: var(--bg-gray-100);
  color: var(--text-primary);
}

.modal-body {
  padding: 2rem;
}

/* Booking details */
.booking-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section.full-width {
  grid-column: 1 / -1;
}

.detail-section h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--card-border);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--bg-gray-50);
  border-radius: var(--border-radius-medium);
}

.detail-item label {
  font-weight: 600;
  color: var(--text-secondary);
}

.detail-item span {
  color: var(--text-primary);
}

.booking-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.price-highlight {
  font-weight: 700;
  color: var(--electric-blue);
  font-size: 1.2rem;
}

.special-requests {
  color: var(--text-secondary);
  font-style: italic;
  background: var(--bg-gray-50);
  padding: 1rem;
  border-radius: var(--border-radius-medium);
  border-left: 4px solid var(--electric-blue);
}

.booking-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid var(--card-border);
}

/* Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid var(--bg-gray-200);
  border-top: 4px solid var(--electric-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Icônes */
.icon {
  display: inline-block;
  line-height: 1;
  font-style: normal;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .analytics-section {
    grid-template-columns: 1fr;
  }

  .booking-details-grid {
    grid-template-columns: 1fr;
  }

  .bookings-table {
    font-size: 0.9rem;
  }

  .bookings-table th,
  .bookings-table td {
    padding: 0.75rem 0.5rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .filters-section {
    flex-direction: column;
  }

  .filters {
    flex-direction: column;
    width: 100%;
  }

  .filter-select,
  .filter-date {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .booking-actions {
    flex-direction: column;
  }

  .container {
    padding: 0 0.5rem;
  }

  /* Table responsive */
  .bookings-table-container {
    overflow-x: auto;
  }

  .bookings-table {
    min-width: 1200px;
  }

  .booking-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
