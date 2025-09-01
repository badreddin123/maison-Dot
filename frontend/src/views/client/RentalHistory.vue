<template>
  <div class="rental-history">
    <!-- En-tête -->
    <div class="history-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">Historique des loyers</h1>
          <p class="page-subtitle">
            Consultez l'historique de vos loyers et exportez vos factures
          </p>
        </div>
        
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-icon houses">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ houseRentals.length }}</div>
              <div class="stat-label">Maisons</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon apartments">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 21h18M4 21V8a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v13M8 10h1m0 0v1m0-1h1m-1 0V9M8 14h1m0 0v1m0-1h1m-1 0v-1M8 18h1m0 0v1m0-1h1m-1 0v-1M12 10h1m0 0v1m0-1h1m-1 0V9M12 14h1m0 0v1m0-1h1m-1 0v-1M12 18h1m0 0v1m0-1h1m-1 0v-1"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ apartmentRentals.length }}</div>
              <div class="stat-label">Appartements</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon offices">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 9h1m-1 4h1m4-4h1m-1 4h1"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ officeRentals.length }}</div>
              <div class="stat-label">Bureaux</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon total">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ formatCurrency(totalRentPaid) }}</div>
              <div class="stat-label">Total payé</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres et contrôles -->
    <div class="controls-section">
      <div class="filters-row">
        <!-- Filtres par type de propriété -->
        <div class="property-type-filters">
          <button
            v-for="type in propertyTypeOptions"
            :key="type.value"
            @click="activeTypeFilter = type.value"
            :class="{ active: activeTypeFilter === type.value }"
            class="type-filter-btn"
          >
            <div class="filter-icon" v-html="type.icon"></div>
            <span>{{ type.label }}</span>
            <span class="filter-count">{{ getRentalCountByType(type.value) }}</span>
          </button>
        </div>
        
        <!-- Filtres par année -->
        <div class="year-filter">
          <select v-model="selectedYear" class="year-select">
            <option value="">Toutes les années</option>
            <option 
              v-for="year in availableYears" 
              :key="year" 
              :value="year"
            >
              {{ year }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="controls-row">
        <!-- Recherche -->
        <div class="search-container">
          <div class="search-input-group">
            <div class="search-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher par propriété ou adresse..."
              class="search-input"
            />
          </div>
        </div>
        
        <!-- Export des factures sélectionnées -->
        <div class="export-actions" v-if="selectedRentals.length > 0">
          <!-- TODO: Adapter BulkInvoiceExport pour RentalData ou créer un composant spécifique -->
          <div class="export-selected-info">
            {{ selectedRentals.length }} loyer(s) sélectionné(s) pour l'export
          </div>
        </div>
        
        <!-- Export général -->
        <div class="general-export">
          <button @click="exportAllRentals" class="export-all-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <path d="M16 13H8M16 17H8"/>
            </svg>
            Exporter tout l'historique
          </button>
        </div>
      </div>
    </div>

    <!-- Historique des loyers -->
    <div class="rentals-section">
      <div v-if="rentalHistoryStore.isLoading" class="loading-state">
        <div class="cyber-spinner"></div>
        <p>Chargement de l'historique...</p>
      </div>
      
      <div v-else-if="filteredRentals.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <h3>Aucun loyer trouvé</h3>
        <p>{{ getEmptyStateMessage() }}</p>
      </div>
      
      <div v-else class="rentals-list">
        <div class="table-container">
          <table class="rentals-table">
            <thead>
              <tr>
                <th class="checkbox-col">
                  <input
                    type="checkbox"
                    :checked="allFilteredSelected"
                    @change="toggleAllFiltered"
                    class="table-checkbox"
                  />
                </th>
                <th>Propriété</th>
                <th>Type</th>
                <th>Période</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(rental, index) in paginatedRentals"
                :key="rental.id"
                class="rental-row"
                :class="[rental.property?.type, { selected: selectedRentals.includes(rental.id) }]"
                :style="{ animationDelay: `${index * 0.05}s` }"
              >
                <td class="checkbox-col">
                  <input
                    type="checkbox"
                    :value="rental.id"
                    v-model="selectedRentals"
                    class="table-checkbox"
                  />
                </td>
                
                <td class="property-col">
                  <div class="property-info">
                    <div class="property-image">
                      <img 
                        :src="rental.property?.images?.[0] || '/placeholder-property.jpg'" 
                        :alt="rental.property?.title"
                        @error="handleImageError"
                      />
                    </div>
                    <div class="property-details">
                      <div class="property-name">{{ rental.property?.title }}</div>
                      <div class="property-address">{{ rental.property?.address }}</div>
                    </div>
                  </div>
                </td>
                
                <td class="type-col">
                  <div class="type-badge" :class="rental.property?.type">
                    <div class="type-icon" v-html="getPropertyTypeIcon(rental.property?.type)"></div>
                    <span>{{ getPropertyTypeLabel(rental.property?.type) }}</span>
                  </div>
                </td>
                
                <td class="period-col">
                  <div class="period-info">
                    <div class="period-dates">
                      <span class="start-date">{{ formatDate(rental.start_date) }}</span>
                      <span class="separator">→</span>
                      <span class="end-date">{{ formatDate(rental.end_date) }}</span>
                    </div>
                    <div class="period-duration">
                      {{ getDurationInMonths(rental.start_date, rental.end_date) }} mois
                    </div>
                  </div>
                </td>
                
                <td class="amount-col">
                  <div class="amount-info">
                    <div class="total-amount">{{ formatCurrency(rental.total_price) }}</div>
                    <div class="monthly-amount">
                      {{ formatCurrency(rental.monthly_rent) }}/mois
                    </div>
                  </div>
                </td>
                
                <td class="status-col">
                  <div class="status-badge" :class="rental.payment_status">
                    <div class="status-dot"></div>
                    {{ getPaymentStatusLabel(rental.payment_status) }}
                  </div>
                </td>
                
                <td class="actions-col">
                  <div class="action-buttons">
                    <button
                      @click="viewRentalDetails(rental)"
                      class="action-btn view"
                      title="Voir les détails"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                    
                    <button
                      @click="generateRentalInvoice(rental)"
                      class="action-btn invoice"
                      title="Générer la facture de loyer"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    </button>
                    
                    <button
                      v-if="rental.payment_status === 'paid'"
                      @click="downloadReceipt(rental)"
                      class="action-btn download"
                      title="Télécharger le reçu"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Précédent
          </button>
          
          <div class="pagination-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="{ active: currentPage === page }"
              class="pagination-number"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            Suivant
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de détails du loyer -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal-content rental-details-modal" @click.stop>
        <div class="modal-header">
          <h3>Détails du loyer</h3>
          <button @click="closeDetailsModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body" v-if="selectedRentalDetails">
          <div class="details-grid">
            <div class="detail-section">
              <h4>Propriété</h4>
              <div class="detail-item">
                <span class="detail-label">Nom :</span>
                <span class="detail-value">{{ selectedRentalDetails.property?.title }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Type :</span>
                <span class="detail-value">{{ getPropertyTypeLabel(selectedRentalDetails.property?.type) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Adresse :</span>
                <span class="detail-value">{{ selectedRentalDetails.property?.address }}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>Période de location</h4>
              <div class="detail-item">
                <span class="detail-label">Début :</span>
                <span class="detail-value">{{ formatDate(selectedRentalDetails.start_date) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Fin :</span>
                <span class="detail-value">{{ formatDate(selectedRentalDetails.end_date) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Durée :</span>
                <span class="detail-value">
                  {{ getDurationInMonths(selectedRentalDetails.start_date, selectedRentalDetails.end_date) }} mois
                </span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>Informations financières</h4>
              <div class="detail-item">
                <span class="detail-label">Loyer mensuel :</span>
                <span class="detail-value strong">{{ formatCurrency(selectedRentalDetails.monthly_rent) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Total payé :</span>
                <span class="detail-value strong">{{ formatCurrency(selectedRentalDetails.total_price) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Statut de paiement :</span>
                <div class="status-badge" :class="selectedRentalDetails.payment_status">
                  {{ getPaymentStatusLabel(selectedRentalDetails.payment_status) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TODO: Adapter InvoiceGenerator pour RentalData ou créer un composant spécifique -->
    <div v-if="showInvoiceGenerator" class="modal-overlay" @click="closeInvoiceGenerator">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Génération de facture</h3>
          <button @click="closeInvoiceGenerator" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>Génération de facture pour : {{ selectedRentalForInvoice?.property?.title }}</p>
          <p>Montant : {{ formatCurrency(selectedRentalForInvoice?.total_price || 0) }}</p>
          <!-- TODO: Implémenter la génération de facture -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRentalHistoryStore } from '../../stores/rentalHistory'
import type { RentalData } from '../../stores/rentalHistory'
// import InvoiceGenerator from '../../components/InvoiceGenerator.vue'
// import BulkInvoiceExport from '../../components/BulkInvoiceExport.vue'
import { useToast } from '../../composables/useToast'

// Stores et composables
const rentalHistoryStore = useRentalHistoryStore()
const { success, error } = useToast()

// État local
const activeTypeFilter = ref('all')
const selectedYear = ref('')
const searchQuery = ref('')
const selectedRentals = ref<number[]>([])
const currentPage = ref(1)
const itemsPerPage = 10

// Modals
const showDetailsModal = ref(false)
const showInvoiceGenerator = ref(false)
const selectedRentalDetails = ref<RentalData | null>(null)
const selectedRentalForInvoice = ref<RentalData | null>(null)

// Options de filtrage
const propertyTypeOptions = [
  {
    value: 'all',
    label: 'Tous les types',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'
  },
  {
    value: 'house',
    label: 'Maisons',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/></svg>'
  },
  {
    value: 'apartment',
    label: 'Appartements',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M4 21V8a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v13M8 10h1m0 0v1m0-1h1m-1 0V9M8 14h1m0 0v1m0-1h1m-1 0v-1M8 18h1m0 0v1m0-1h1m-1 0v-1M12 10h1m0 0v1m0-1h1m-1 0V9M12 14h1m0 0v1m0-1h1m-1 0v-1M12 18h1m0 0v1m0-1h1m-1 0v-1"/></svg>'
  },
  {
    value: 'office',
    label: 'Bureaux',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 9h1m-1 4h1m4-4h1m-1 4h1"/></svg>'
  }
]

// Computed properties
const rentalHistory = computed(() => rentalHistoryStore.clientRentals || [])

const filteredRentals = computed(() => {
  let rentals = rentalHistory.value

  // Filtre par type de propriété
  if (activeTypeFilter.value !== 'all') {
    rentals = rentals.filter((rental: RentalData) => 
      rental.property?.type === activeTypeFilter.value
    )
  }

  // Filtre par année
  if (selectedYear.value) {
    rentals = rentals.filter((rental: RentalData) => 
      new Date(rental.start_date).getFullYear().toString() === selectedYear.value
    )
  }

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    rentals = rentals.filter((rental: RentalData) =>
      rental.property?.title?.toLowerCase().includes(query) ||
      rental.property?.address?.toLowerCase().includes(query)
    )
  }

  return rentals
})

const paginatedRentals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredRentals.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(filteredRentals.value.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const allFilteredSelected = computed(() => {
  return paginatedRentals.value.length > 0 && 
         paginatedRentals.value.every((rental: RentalData) => selectedRentals.value.includes(rental.id))
})

const houseRentals = computed(() => 
  rentalHistory.value.filter((rental: RentalData) => rental.property?.type === 'house')
)

const apartmentRentals = computed(() => 
  rentalHistory.value.filter((rental: RentalData) => rental.property?.type === 'apartment')
)

const officeRentals = computed(() => 
  rentalHistory.value.filter((rental: RentalData) => rental.property?.type === 'office')
)

const totalRentPaid = computed(() => 
  rentalHistory.value.reduce((sum: number, rental: RentalData) => sum + rental.total_price, 0)
)

const availableYears = computed(() => {
  const years = new Set<number>(
    rentalHistory.value.map((rental: RentalData) => 
      new Date(rental.start_date).getFullYear()
    )
  )
  return Array.from(years).sort((a: number, b: number) => b - a)
})

// Méthodes
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getDurationInMonths = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
}

const getPropertyTypeLabel = (type?: string) => {
  const labels: Record<string, string> = {
    house: 'Maison',
    apartment: 'Appartement',
    office: 'Bureau'
  }
  return labels[type || ''] || type || 'Inconnu'
}

const getPropertyTypeIcon = (type?: string) => {
  const icons: Record<string, string> = {
    house: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/></svg>',
    apartment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M4 21V8a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v13M8 10h1m0 0v1m0-1h1m-1 0V9M8 14h1m0 0v1m0-1h1m-1 0v-1M8 18h1m0 0v1m0-1h1m-1 0v-1M12 10h1m0 0v1m0-1h1m-1 0V9M12 14h1m0 0v1m0-1h1m-1 0v-1M12 18h1m0 0v1m0-1h1m-1 0v-1"/></svg>',
    office: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 9h1m-1 4h1m4-4h1m-1 4h1"/></svg>'
  }
  return icons[type || ''] || icons.apartment
}

const getPaymentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    paid: 'Payé',
    pending: 'En attente',
    overdue: 'En retard',
    cancelled: 'Annulé'
  }
  return labels[status] || status
}

const getRentalCountByType = (type: string) => {
  if (type === 'all') return rentalHistory.value.length
  return rentalHistory.value.filter((rental: RentalData) => rental.property?.type === type).length
}

const getEmptyStateMessage = () => {
  if (activeTypeFilter.value !== 'all') {
    return `Aucun loyer trouvé pour les ${getPropertyTypeLabel(activeTypeFilter.value).toLowerCase()}s.`
  }
  if (searchQuery.value) {
    return `Aucun loyer trouvé pour "${searchQuery.value}".`
  }
  return 'Vous n\'avez encore aucun historique de loyer.'
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-property.jpg'
}

const toggleAllFiltered = () => {
  if (allFilteredSelected.value) {
    selectedRentals.value = selectedRentals.value.filter(id => 
      !paginatedRentals.value.some((rental: RentalData) => rental.id === id)
    )
  } else {
    const newSelections = paginatedRentals.value.map((rental: RentalData) => rental.id)
    selectedRentals.value = [...new Set([...selectedRentals.value, ...newSelections])]
  }
}

const viewRentalDetails = (rental: RentalData) => {
  selectedRentalDetails.value = rental
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedRentalDetails.value = null
}

const generateRentalInvoice = (rental: RentalData) => {
  selectedRentalForInvoice.value = rental
  showInvoiceGenerator.value = true
}

const closeInvoiceGenerator = () => {
  showInvoiceGenerator.value = false
  selectedRentalForInvoice.value = null
}

const downloadReceipt = (rental: RentalData) => {
  // Logique pour télécharger le reçu
  success('Reçu téléchargé', `Reçu pour ${rental.property?.title} téléchargé avec succès`)
}

const exportAllRentals = () => {
  if (filteredRentals.value.length === 0) {
    error('Aucun loyer à exporter', 'Aucun loyer trouvé avec les filtres actuels')
    return
  }
  
  // Sélectionner tous les loyers filtrés pour l'export
  selectedRentals.value = filteredRentals.value.map((rental: RentalData) => rental.id)
  
  success('Export préparé', `${filteredRentals.value.length} loyers sélectionnés pour l'export`)
}

// TODO: Réimplémenter quand BulkInvoiceExport sera adapté
// const handleExportComplete = (isSuccess: boolean, message: string) => {
//   if (isSuccess) {
//     success('Export réussi', message)
//     selectedRentals.value = [] // Réinitialiser la sélection
//   } else {
//     error('Erreur d\'export', message)
//   }
// }

// Lifecycle
onMounted(async () => {
  await rentalHistoryStore.fetchClientRentals()
})
</script>

<style scoped>
@import url('../../assets/cyber-theme.css');

.rental-history {
  min-height: 100vh;
  background: var(--bg-gradient-main);
  padding: 2rem;
}

.history-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.header-info h1 {
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.header-info p {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.header-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 1.5rem;
  text-align: center;
  transition: var(--transition-smooth);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-cyber);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.houses {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.stat-icon.apartments {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.stat-icon.offices {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.stat-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.controls-section {
  background: var(--glass-bg-light);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 2rem;
  margin-bottom: 2rem;
}

.filters-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.property-type-filters {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.type-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-smooth);
  font-size: 0.875rem;
  font-weight: 500;
}

.type-filter-btn:hover {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
}

.type-filter-btn.active {
  background: var(--primary-gradient);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-neon-blue);
}

.filter-icon {
  width: 1rem;
  height: 1rem;
}

.filter-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.375rem;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
}

.year-filter {
  min-width: 200px;
}

.year-select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.controls-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-container {
  flex: 1;
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  z-index: 1;
  color: var(--text-muted);
}

.search-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--electric-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.export-actions,
.general-export {
  display: flex;
  gap: 0.5rem;
}

.export-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  font-size: 0.875rem;
}

.export-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.export-all-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.rentals-section {
  background: var(--glass-bg-light);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  overflow: hidden;
}

.loading-state,
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-secondary);
}

.cyber-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid transparent;
  border-top: 3px solid var(--electric-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

.table-container {
  overflow-x: auto;
}

.rentals-table {
  width: 100%;
  border-collapse: collapse;
}

.rentals-table th,
.rentals-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--glass-border);
}

.rentals-table th {
  background: var(--glass-bg-medium);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rental-row {
  transition: var(--transition-smooth);
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.rental-row:hover {
  background: var(--glass-bg-medium);
}

.rental-row.selected {
  background: rgba(59, 130, 246, 0.1);
  border-left: 3px solid var(--electric-blue);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.checkbox-col {
  width: 3rem;
}

.table-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--electric-blue);
}

.property-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.property-image {
  width: 3rem;
  height: 3rem;
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  flex-shrink: 0;
}

.property-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.property-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.property-address {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.type-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--border-radius-medium);
  font-size: 0.875rem;
  font-weight: 500;
}

.type-badge.house {
  background: rgba(16, 185, 129, 0.1);
  color: var(--acid-green);
}

.type-badge.apartment {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
}

.type-badge.office {
  background: rgba(245, 158, 11, 0.1);
  color: var(--solar-orange);
}

.type-icon {
  width: 1rem;
  height: 1rem;
}

.type-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.period-dates {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.separator {
  color: var(--text-muted);
}

.period-duration {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.total-amount {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.monthly-amount {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--border-radius-medium);
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.paid {
  background: rgba(16, 185, 129, 0.1);
  color: var(--acid-green);
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: var(--solar-orange);
}

.status-badge.overdue {
  background: rgba(239, 68, 68, 0.1);
  color: var(--laser-red);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: currentColor;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: var(--border-radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.action-btn.view {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
}

.action-btn.invoice {
  background: rgba(139, 92, 246, 0.1);
  color: var(--electric-purple);
}

.action-btn.download {
  background: rgba(16, 185, 129, 0.1);
  color: var(--acid-green);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.action-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-number {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: var(--border-radius-medium);
  background: var(--glass-bg-medium);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.pagination-number:hover {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
}

.pagination-number.active {
  background: var(--primary-gradient);
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-cyber);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid var(--glass-border);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
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

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.detail-section h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--glass-border);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.detail-value {
  color: var(--text-primary);
  font-weight: 500;
}

.detail-value.strong {
  font-weight: 700;
  color: var(--electric-blue);
}

.export-selected-info {
  padding: 0.75rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
  border-radius: var(--border-radius-medium);
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* Responsive */
@media (max-width: 1200px) {
  .header-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .rental-history {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-stats {
    grid-template-columns: 1fr;
    width: 100%;
  }
  
  .filters-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .property-type-filters {
    flex-wrap: wrap;
  }
  
  .controls-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
