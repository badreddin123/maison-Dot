<template>
  <div class="bookings-management ultra-modern-layout">
    <!-- En-tête -->
    <div class="page-header ultra-modern-card">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title ultra-modern-text-gradient">Gestion des réservations</h1>
          <p class="page-subtitle ultra-modern-text-secondary">
            Gérez les réservations de vos propriétés
          </p>
        </div>
        
        <div class="header-stats">
          <div class="stat-card ultra-modern-card ultra-modern-animate-fade-scale">
            <div class="stat-icon pending ultra-modern-gradient-bg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number ultra-modern-text-primary">{{ pendingBookings }}</div>
              <div class="stat-label ultra-modern-text-muted">En attente</div>
            </div>
          </div>
          
          <div class="stat-card ultra-modern-card ultra-modern-animate-fade-scale">
            <div class="stat-icon confirmed ultra-modern-success-bg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number ultra-modern-text-primary">{{ confirmedBookings }}</div>
              <div class="stat-label ultra-modern-text-muted">Confirmées</div>
            </div>
          </div>
          
          <div class="stat-card ultra-modern-card ultra-modern-animate-fade-scale">
            <div class="stat-icon revenue ultra-modern-info-bg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number ultra-modern-text-gradient">{{ formatCurrency(totalRevenue) }}</div>
              <div class="stat-label ultra-modern-text-muted">Revenus du mois</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres et contrôles -->
    <div class="controls-section ultra-modern-card">
      <div class="filters-row">
        <!-- Filtres de statut -->
        <div class="status-filters">
          <button
            v-for="status in statusOptions"
            :key="status.value"
            @click="activeStatusFilter = status.value"
            :class="{ active: activeStatusFilter === status.value }"
            class="status-filter-btn ultra-modern-btn ultra-modern-btn-outline"
          >
            <div class="filter-icon" v-html="status.icon"></div>
            <span>{{ status.label }}</span>
            <span class="filter-count">{{ getBookingCountByStatus(status.value) }}</span>
          </button>
        </div>
        
        <!-- Filtres par propriété -->
        <div class="property-filter">
          <select v-model="selectedProperty" class="property-select ultra-modern-select">
            <option value="">Toutes les propriétés</option>
            <option 
              v-for="property in myProperties" 
              :key="property.id" 
              :value="property.id"
            >
              {{ property.title }}
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
              placeholder="Rechercher par client ou propriété..."
              class="search-input ultra-modern-input"
            />
          </div>
        </div>
        
        <!-- Tri -->
        <div class="sort-container">
          <select v-model="sortBy" class="sort-select ultra-modern-select">
            <option value="created_at_desc">Plus récentes</option>
            <option value="created_at_asc">Plus anciennes</option>
            <option value="start_date_desc">Date d'arrivée ↓</option>
            <option value="start_date_asc">Date d'arrivée ↑</option>
            <option value="total_price_desc">Prix ↓</option>
            <option value="total_price_asc">Prix ↑</option>
          </select>
        </div>
        
        <!-- Actions groupées -->
        <div class="bulk-actions" v-if="selectedBookings.length > 0">
          <!-- TODO: Adapter BulkInvoiceExport pour les réservations -->
          <div class="bulk-export-info">
            {{ selectedBookings.length }} réservation(s) sélectionnée(s)
          </div>
          
          <button @click="confirmSelectedBookings" class="bulk-btn confirm ultra-modern-btn ultra-modern-btn-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Confirmer ({{ selectedBookings.length }})
          </button>
          <button @click="cancelSelectedBookings" class="bulk-btn cancel ultra-modern-btn ultra-modern-btn-danger">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            Annuler ({{ selectedBookings.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des réservations -->
    <div class="bookings-section ultra-modern-card">
      <div v-if="bookingsStore.isLoading" class="loading-state">
        <div class="cyber-spinner"></div>
        <p>Chargement des réservations...</p>
      </div>
      
      <div v-else-if="filteredBookings.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <h3 class="ultra-modern-text-primary">Aucune réservation trouvée</h3>
        <p class="ultra-modern-text-secondary">{{ getEmptyStateMessage() }}</p>
      </div>
      
      <div v-else class="bookings-list">
        <div class="table-container">
          <table class="bookings-table">
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
                <th>Client</th>
                <th>Propriété</th>
                <th>Dates</th>
                <th>Durée</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(booking, index) in paginatedBookings"
                :key="booking.id"
                class="booking-row"
                :class="[booking.status, { selected: selectedBookings.includes(booking.id) }]"
                :style="{ animationDelay: `${index * 0.05}s` }"
              >
                <td class="checkbox-col">
                  <input
                    type="checkbox"
                    :value="booking.id"
                    v-model="selectedBookings"
                    class="table-checkbox"
                  />
                </td>
                
                <td class="client-col">
                  <div class="client-info">
                    <div class="client-avatar">
                      {{ booking.client?.name?.charAt(0).toUpperCase() }}
                    </div>
                    <div class="client-details">
                      <div class="client-name">{{ booking.client?.name }}</div>
                      <div class="client-email">{{ booking.client?.email }}</div>
                    </div>
                  </div>
                </td>
                
                <td class="property-col">
                  <div class="property-info">
                    <div class="property-image">
                      <img 
                        :src="getPropertyImageUrl(booking.property?.images?.[0]) || '/placeholder-property.svg'" 
                        :alt="booking.property?.title"
                        @error="handleImageError"
                      />
                    </div>
                    <div class="property-details">
                      <div class="property-name">{{ booking.property?.title }}</div>
                      <div class="property-type">{{ getPropertyTypeLabel(booking.property?.type) }}</div>
                    </div>
                  </div>
                </td>
                
                <td class="dates-col">
                  <div class="dates-info">
                    <div class="date-item">
                      <span class="date-label">Arrivée:</span>
                      <span class="date-value">{{ formatDate(booking.start_date) }}</span>
                    </div>
                    <div class="date-item">
                      <span class="date-label">Départ:</span>
                      <span class="date-value">{{ formatDate(booking.end_date) }}</span>
                    </div>
                  </div>
                </td>
                
                <td class="duration-col">
                  <div class="duration-badge">
                    {{ getDurationInNights(booking.start_date, booking.end_date) }} 
                    {{ getDurationInNights(booking.start_date, booking.end_date) === 1 ? 'nuit' : 'nuits' }}
                  </div>
                </td>
                
                <td class="amount-col">
                  <div class="amount-info">
                    <div class="total-amount">{{ formatCurrency(booking.total_price) }}</div>
                    <div class="per-night">
                      {{ formatCurrency(booking.total_price / getDurationInNights(booking.start_date, booking.end_date)) }}/nuit
                    </div>
                  </div>
                </td>
                
                <td class="status-col">
                  <div class="status-badge" :class="booking.status">
                    <div class="status-dot"></div>
                    {{ getStatusLabel(booking.status) }}
                  </div>
                </td>
                
                <td class="actions-col">
                  <div class="action-buttons">
                    <button
                      v-if="booking.status === 'pending'"
                      @click="confirmBooking(booking)"
                      class="action-btn confirm"
                      title="Confirmer la réservation"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>
                    
                    <button
                      v-if="booking.status === 'pending' || booking.status === 'confirmed'"
                      @click="cancelBooking(booking)"
                      class="action-btn cancel"
                      title="Annuler la réservation"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    </button>
                    
                    <button
                      @click="viewBookingDetails(booking)"
                      class="action-btn view"
                      title="Voir les détails"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                    
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
                    </button>
                    
                    <button
                      @click="contactClient(booking.client)"
                      class="action-btn contact"
                      title="Contacter le client"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 8l7.89 2.26a2 2 0 001.23 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
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

    <!-- Modal de détails de réservation -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal-content booking-details-modal" @click.stop>
        <div class="modal-header">
          <h3>Détails de la réservation</h3>
          <button @click="closeDetailsModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body" v-if="selectedBookingDetails">
          <div class="details-grid">
            <div class="detail-section">
              <h4>Informations client</h4>
              <div class="detail-items">
                <div class="detail-item">
                  <span class="detail-label">Nom:</span>
                  <span class="detail-value">{{ selectedBookingDetails.client?.name }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">{{ selectedBookingDetails.client?.email }}</span>
                </div>
                <div v-if="selectedBookingDetails.client?.phone" class="detail-item">
                  <span class="detail-label">Téléphone:</span>
                  <span class="detail-value">{{ selectedBookingDetails.client?.phone }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>Détails du séjour</h4>
              <div class="detail-items">
                <div class="detail-item">
                  <span class="detail-label">Arrivée:</span>
                  <span class="detail-value">{{ formatDate(selectedBookingDetails.start_date) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Départ:</span>
                  <span class="detail-value">{{ formatDate(selectedBookingDetails.end_date) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Durée:</span>
                  <span class="detail-value">
                    {{ getDurationInNights(selectedBookingDetails.start_date, selectedBookingDetails.end_date) }} nuits
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Voyageurs:</span>
                  <span class="detail-value">{{ selectedBookingDetails.guests || 2 }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>Informations financières</h4>
              <div class="detail-items">
                <div class="detail-item">
                  <span class="detail-label">Prix total:</span>
                  <span class="detail-value strong">{{ formatCurrency(selectedBookingDetails.total_price) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Prix par nuit:</span>
                  <span class="detail-value">
                    {{ formatCurrency(selectedBookingDetails.total_price / getDurationInNights(selectedBookingDetails.start_date, selectedBookingDetails.end_date)) }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Statut:</span>
                  <span class="detail-value">
                    <div class="status-badge" :class="selectedBookingDetails.status">
                      <div class="status-dot"></div>
                      {{ getStatusLabel(selectedBookingDetails.status) }}
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="closeDetailsModal" class="btn secondary">Fermer</button>
          <button 
            v-if="selectedBookingDetails?.status === 'pending'"
            @click="confirmBooking(selectedBookingDetails)"
            class="btn primary"
          >
            Confirmer la réservation
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de génération de facture -->
    <div v-if="showInvoiceModal && selectedBookingForInvoice" class="modal-overlay" @click="closeInvoiceModal">
      <div class="modal-content invoice-modal" @click.stop>
        <div class="modal-header">
          <h3>Génération de facture</h3>
          <button @click="closeInvoiceModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div v-if="!invoicePreview" class="invoice-form">
            <div class="invoice-summary">
              <h4>Résumé de la réservation</h4>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="label">Propriété:</span>
                  <span class="value">{{ selectedBookingForInvoice.property?.title }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Client:</span>
                  <span class="value">{{ selectedBookingForInvoice.client?.name }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Email:</span>
                  <span class="value">{{ selectedBookingForInvoice.client?.email }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Période:</span>
                  <span class="value">
                    {{ formatDate(selectedBookingForInvoice.start_date) }} - {{ formatDate(selectedBookingForInvoice.end_date) }}
                  </span>
                </div>
                <div class="summary-item">
                  <span class="label">Durée:</span>
                  <span class="value">
                    {{ getDurationInNights(selectedBookingForInvoice.start_date, selectedBookingForInvoice.end_date) }} nuits
                  </span>
                </div>
                <div class="summary-item">
                  <span class="label">Invités:</span>
                  <span class="value">{{ selectedBookingForInvoice.guests || 2 }}</span>
                </div>
                <div class="summary-item total">
                  <span class="label">Montant total:</span>
                  <span class="value">{{ formatCurrency(selectedBookingForInvoice.total_price) }}</span>
                </div>
              </div>
            </div>

            <div class="invoice-actions">
              <button @click="previewInvoice" class="btn preview-btn" :disabled="isGeneratingPreview">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                {{ isGeneratingPreview ? 'Génération...' : 'Aperçu de la facture' }}
              </button>
              
              <button @click="generateAndDownloadInvoice" class="btn generate-btn" :disabled="isGeneratingInvoice">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                {{ isGeneratingInvoice ? 'Génération...' : 'Télécharger la facture PDF' }}
              </button>
            </div>
          </div>

          <!-- Aperçu de la facture -->
          <div v-if="invoicePreview" class="invoice-preview">
            <div class="preview-header">
              <h4>Aperçu de la facture</h4>
              <button @click="backToForm" class="btn secondary-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Retour
              </button>
            </div>
            
            <div class="preview-container">
              <iframe 
                :src="invoicePreview" 
                class="pdf-preview"
                title="Aperçu de la facture"
              ></iframe>
            </div>
            
            <div class="preview-actions">
              <button @click="generateAndDownloadInvoice" class="btn generate-btn" :disabled="isGeneratingInvoice">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                {{ isGeneratingInvoice ? 'Téléchargement...' : 'Télécharger cette facture' }}
              </button>
            </div>
          </div>

          <!-- Messages d'erreur -->
          <div v-if="invoiceError" class="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ invoiceError }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useBookingsStore, type Booking } from '../../stores/bookings'
import { usePropertiesStore } from '../../stores/properties'
import { invoiceService } from '../../services/invoiceService'
// import InvoiceGenerator from '../../components/InvoiceGenerator.vue'
// import BulkInvoiceExport from '../../components/BulkInvoiceExport.vue'
// import { useToast } from '../../composables/useToast'

const bookingsStore = useBookingsStore()
const propertiesStore = usePropertiesStore()
// const { success, error } = useToast()

// État local
const activeStatusFilter = ref('all')
const selectedProperty = ref('')
const searchQuery = ref('')
const sortBy = ref('created_at_desc')
const selectedBookings = ref<number[]>([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showDetailsModal = ref(false)
const showInvoiceModal = ref(false)
const selectedBookingDetails = ref<Booking | null>(null)
const selectedBookingForInvoice = ref<Booking | null>(null)
const invoicePreview = ref<string | null>(null)
const isGeneratingPreview = ref(false)
const isGeneratingInvoice = ref(false)
const invoiceError = ref<string | null>(null)

// Options de filtres
const statusOptions = [
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
const myProperties = computed(() => propertiesStore.myProperties || [])

const managerBookings = computed(() => bookingsStore.managerBookings || [])

const filteredBookings = computed(() => {
  let bookings = [...managerBookings.value]
  
  // Filtrage par statut
  if (activeStatusFilter.value !== 'all') {
    bookings = bookings.filter(booking => booking.status === activeStatusFilter.value)
  }
  
  // Filtrage par propriété
  if (selectedProperty.value) {
    bookings = bookings.filter(booking => booking.property_id === Number(selectedProperty.value))
  }
  
  // Filtrage par recherche
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    bookings = bookings.filter(booking =>
      booking.client?.name?.toLowerCase().includes(query) ||
      booking.client?.email?.toLowerCase().includes(query) ||
      booking.property?.title?.toLowerCase().includes(query)
    )
  }
  
  // Tri
  bookings.sort((a, b) => {
    switch (sortBy.value) {
      case 'created_at_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'created_at_desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'start_date_asc':
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      case 'start_date_desc':
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      case 'total_price_asc':
        return a.total_price - b.total_price
      case 'total_price_desc':
        return b.total_price - a.total_price
      default:
        return 0
    }
  })
  
  return bookings
})

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBookings.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredBookings.value.length / itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const allFilteredSelected = computed(() => {
  return paginatedBookings.value.length > 0 && 
         paginatedBookings.value.every(booking => selectedBookings.value.includes(booking.id))
})

const pendingBookings = computed(() => {
  return managerBookings.value.filter(booking => booking.status === 'pending').length
})

const confirmedBookings = computed(() => {
  return managerBookings.value.filter(booking => booking.status === 'confirmed').length
})

const totalRevenue = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return managerBookings.value
    .filter(booking => {
      const bookingDate = new Date(booking.created_at)
      return bookingDate.getMonth() === currentMonth && 
             bookingDate.getFullYear() === currentYear &&
             (booking.status === 'confirmed' || booking.status === 'completed')
    })
    .reduce((sum, booking) => sum + booking.total_price, 0)
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
    month: 'short',
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

const getPropertyTypeLabel = (type?: string) => {
  const labels: Record<string, string> = {
    house: 'Maison',
    apartment: 'Appartement',
    office: 'Bureau'
  }
  return labels[type || ''] || type || 'Inconnu'
}

const getBookingCountByStatus = (status: string) => {
  if (status === 'all') return managerBookings.value.length
  return managerBookings.value.filter(booking => booking.status === status).length
}

const getEmptyStateMessage = () => {
  if (activeStatusFilter.value !== 'all') {
    return `Aucune réservation ${getStatusLabel(activeStatusFilter.value).toLowerCase()} trouvée.`
  }
  if (searchQuery.value) {
    return `Aucune réservation trouvée pour "${searchQuery.value}".`
  }
  return 'Vous n\'avez encore aucune réservation.'
}

const getPropertyImageUrl = (imagePath?: string) => {
  if (!imagePath) return null
  
  // Si l'image commence par http/https, c'est une URL complète
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // Sinon, construire l'URL avec le domaine du backend
  const backendUrl = 'http://localhost:8000'
  return `${backendUrl}/${imagePath}`
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-property.svg'
}

const toggleAllFiltered = () => {
  if (allFilteredSelected.value) {
    selectedBookings.value = selectedBookings.value.filter(id => 
      !paginatedBookings.value.some(booking => booking.id === id)
    )
  } else {
    const newSelections = paginatedBookings.value.map(booking => booking.id)
    selectedBookings.value = [...new Set([...selectedBookings.value, ...newSelections])]
  }
}

const confirmBooking = async (booking: Booking) => {
  try {
    const result = await bookingsStore.confirmBooking(booking.id)
    if (result.success) {
      console.log('Réservation confirmée')
      closeDetailsModal()
    }
  } catch (error) {
    console.error('Erreur lors de la confirmation:', error)
  }
}

const cancelBooking = async (booking: Booking) => {
  if (confirm(`Êtes-vous sûr de vouloir annuler la réservation de ${booking.client?.name} ?`)) {
    try {
      const result = await bookingsStore.cancelBooking(booking.id, 'Annulation par le manager')
      if (result.success) {
        console.log('Réservation annulée')
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error)
    }
  }
}

const confirmSelectedBookings = async () => {
  if (confirm(`Confirmer ${selectedBookings.value.length} réservations ?`)) {
    for (const bookingId of selectedBookings.value) {
      try {
        await bookingsStore.confirmBooking(bookingId)
      } catch (error) {
        console.error('Erreur lors de la confirmation groupée:', error)
      }
    }
    selectedBookings.value = []
  }
}

const cancelSelectedBookings = async () => {
  if (confirm(`Annuler ${selectedBookings.value.length} réservations ?`)) {
    for (const bookingId of selectedBookings.value) {
      try {
        await bookingsStore.cancelBooking(bookingId, 'Annulation groupée par le manager')
      } catch (error) {
        console.error('Erreur lors de l\'annulation groupée:', error)
      }
    }
    selectedBookings.value = []
  }
}

const viewBookingDetails = (booking: Booking) => {
  selectedBookingDetails.value = booking
  showDetailsModal.value = true
}

const generateInvoice = (booking: Booking) => {
  selectedBookingForInvoice.value = booking
  showInvoiceModal.value = true
  // Réinitialiser l'état de la modal
  invoicePreview.value = null
  invoiceError.value = null
  isGeneratingPreview.value = false
  isGeneratingInvoice.value = false
}

const closeInvoiceModal = () => {
  showInvoiceModal.value = false
  selectedBookingForInvoice.value = null
  invoicePreview.value = null
  invoiceError.value = null
  isGeneratingPreview.value = false
  isGeneratingInvoice.value = false
}

const previewInvoice = async () => {
  if (!selectedBookingForInvoice.value) return

  try {
    isGeneratingPreview.value = true
    invoiceError.value = null
    
    const previewUrl = invoiceService.previewInvoice(selectedBookingForInvoice.value)
    invoicePreview.value = previewUrl
    
    console.log('Aperçu de la facture généré avec succès')
  } catch (error) {
    console.error('Erreur lors de la génération de l\'aperçu:', error)
    invoiceError.value = error instanceof Error ? error.message : 'Erreur lors de la génération de l\'aperçu'
  } finally {
    isGeneratingPreview.value = false
  }
}

const generateAndDownloadInvoice = async () => {
  if (!selectedBookingForInvoice.value) return

  try {
    isGeneratingInvoice.value = true
    invoiceError.value = null
    
    invoiceService.downloadInvoice(selectedBookingForInvoice.value)
    
    console.log('Facture téléchargée avec succès')
    
    // Fermer la modal après un court délai
    setTimeout(() => {
      closeInvoiceModal()
    }, 1000)
    
  } catch (error) {
    console.error('Erreur lors de la génération de la facture:', error)
    invoiceError.value = error instanceof Error ? error.message : 'Erreur lors de la génération de la facture'
  } finally {
    isGeneratingInvoice.value = false
  }
}

const backToForm = () => {
  invoicePreview.value = null
  invoiceError.value = null
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedBookingDetails.value = null
}

const contactClient = (client?: { email?: string }) => {
  if (client?.email) {
    window.location.href = `mailto:${client.email}`
  }
}

// TODO: Réimplémenter quand BulkInvoiceExport sera adapté
// const handleExportComplete = (isSuccess: boolean, message: string) => {
//   if (isSuccess) {
//     success('Export réussi', message)
//   } else {
//     error('Erreur d\'export', message)
//   }
// }

// Watchers
watch(() => filteredBookings.value.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    bookingsStore.fetchManagerBookings(),
    propertiesStore.fetchMyProperties()
  ])
})
</script>

<style scoped>
@import url('../../assets/cyber-theme.css');
@import url('../../assets/ultra-modern-theme.css');

.bookings-management {
  min-height: 100vh;
  background: var(--bg-main);
  padding: 2rem;
}

.page-header {
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

.page-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 12px rgba(67, 0, 255, 0.3);
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 60px;
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
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  min-width: 150px;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.pending {
  background: rgba(245, 158, 11, 0.1);
  color: var(--solar-orange);
  border: 2px solid rgba(245, 158, 11, 0.3);
}

.stat-icon.confirmed {
  background: rgba(16, 185, 129, 0.1);
  color: var(--acid-green);
  border: 2px solid rgba(16, 185, 129, 0.3);
}

.stat-icon.revenue {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
  border: 2px solid rgba(59, 130, 246, 0.3);
}

.stat-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
}

.stat-number {
  font-size: 1.5rem;
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

.controls-section {
  background: var(--card-bg);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-large);
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: var(--shadow-card);
}

.filters-row {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.status-filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.status-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  font-size: 0.875rem;
}

.status-filter-btn:hover {
  background: var(--glass-bg-medium);
  color: var(--text-primary);
}

.status-filter-btn.active {
  background: var(--primary-gradient);
  color: white;
  border-color: var(--electric-blue);
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
  background: var(--glass-bg-strong);
  color: var(--text-primary);
  padding: 0.125rem 0.375rem;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 1.25rem;
  text-align: center;
}

.status-filter-btn.active .filter-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.property-filter {
  flex: 1;
  max-width: 300px;
}

.property-select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 0.875rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.controls-row {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-input-group {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-muted);
}

.search-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--electric-blue);
  background: var(--glass-bg-medium);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.sort-container {
  min-width: 180px;
}

.sort-select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 0.875rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.bulk-actions {
  display: flex;
  gap: 0.75rem;
}

.bulk-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.bulk-btn.confirm {
  background: rgba(16, 185, 129, 0.1);
  color: var(--acid-green);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.bulk-btn.confirm:hover {
  background: rgba(16, 185, 129, 0.2);
}

.bulk-btn.cancel {
  background: rgba(255, 0, 64, 0.1);
  color: var(--laser-red);
  border: 1px solid rgba(255, 0, 64, 0.3);
}

.bulk-btn.cancel:hover {
  background: rgba(255, 0, 64, 0.2);
}

.bulk-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.bulk-export-info {
  padding: 0.75rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
  border-radius: var(--border-radius-medium);
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.bookings-section {
  background: var(--card-bg);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-large);
  padding: 2rem;
  box-shadow: var(--shadow-card);
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
  font-size: 1.125rem;
}

.table-container {
  overflow-x: auto;
  border-radius: var(--border-radius-medium);
}

.bookings-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--glass-bg-light);
}

.bookings-table th,
.bookings-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--glass-border);
}

.bookings-table th {
  background: var(--glass-bg-medium);
  color: var(--text-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.875rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.booking-row {
  transition: var(--transition-smooth);
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.booking-row:hover {
  background: var(--glass-bg-medium);
}

.booking-row.selected {
  background: rgba(0, 229, 255, 0.05);
  border-left: 3px solid var(--electric-blue);
}

.checkbox-col {
  width: 50px;
}

.table-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--electric-blue);
}

.client-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.client-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

.client-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.client-email {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.property-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.property-image {
  width: 3rem;
  height: 3rem;
  border-radius: var(--border-radius-small);
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

.property-type {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.dates-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 50px;
}

.date-value {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.duration-badge {
  padding: 0.375rem 0.75rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-small);
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  text-align: center;
  white-space: nowrap;
}

.amount-info {
  text-align: right;
}

.total-amount {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.per-night {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: var(--solar-orange);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-badge.confirmed {
  background: rgba(16, 185, 129, 0.1);
  color: var(--acid-green);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge.completed {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-badge.cancelled {
  background: rgba(255, 0, 64, 0.1);
  color: var(--laser-red);
  border: 1px solid rgba(255, 0, 64, 0.3);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  animation: status-pulse 2s ease-in-out infinite;
}

.status-badge.pending .status-dot {
  background: var(--solar-orange);
}

.status-badge.confirmed .status-dot {
  background: var(--acid-green);
}

.status-badge.completed .status-dot {
  background: var(--electric-blue);
}

.status-badge.cancelled .status-dot {
  background: var(--laser-red);
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: var(--border-radius-small);
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.confirm {
  background: rgba(16, 185, 129, 0.1);
  color: var(--acid-green);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.action-btn.confirm:hover {
  background: rgba(16, 185, 129, 0.2);
  transform: scale(1.1);
}

.action-btn.cancel {
  background: rgba(255, 0, 64, 0.1);
  color: var(--laser-red);
  border: 1px solid rgba(255, 0, 64, 0.3);
}

.action-btn.cancel:hover {
  background: rgba(255, 0, 64, 0.2);
  transform: scale(1.1);
}

.action-btn.view {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.action-btn.view:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: scale(1.1);
}

.action-btn.contact {
  background: var(--glass-bg-medium);
  color: var(--text-secondary);
  border: 1px solid var(--glass-border);
}

.action-btn.contact:hover {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
  transform: scale(1.1);
}

.action-btn.invoice {
  background: var(--glass-bg-light);
  color: var(--electric-blue);
  border: 1px solid rgba(0, 229, 255, 0.3);
}

.action-btn.invoice:hover {
  background: rgba(0, 229, 255, 0.1);
  color: var(--electric-blue);
  transform: scale(1.1);
}

.action-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--glass-border);
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.pagination-btn:not(:disabled):hover {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-number {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
}

.pagination-number.active {
  background: var(--primary-gradient);
  color: white;
  border-color: var(--electric-blue);
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
  padding: 2rem;
}

.modal-content {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slide-up 0.3s ease-out;
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
  font-size: 1.5rem;
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

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.detail-section h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--glass-border);
}

.detail-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--glass-bg-light);
  border-radius: var(--border-radius-medium);
}

.detail-label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.detail-value {
  color: var(--text-primary);
  font-weight: 600;
}

.detail-value.strong {
  font-size: 1.125rem;
  color: var(--electric-blue);
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

.btn.primary {
  background: var(--primary-gradient);
  color: white;
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-neon-blue);
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

/* Styles ultra modernes spécifiques */
.stat-card.ultra-modern-card {
  background: var(--card-bg) !important;
  border: 1px solid var(--border-primary) !important;
  box-shadow: var(--shadow-card) !important;
}

.stat-card.ultra-modern-card:hover {
  border-color: var(--primary-color) !important;
  box-shadow: var(--shadow-elevated) !important;
  transform: translateY(-4px) !important;
}

.status-filter-btn.ultra-modern-btn.active {
  background: var(--gradient-primary) !important;
  color: var(--pure-white) !important;
  border: 2px solid var(--primary-color) !important;
  box-shadow: var(--shadow-neon-blue) !important;
}

.status-filter-btn.ultra-modern-btn:not(.active) {
  background: var(--glassmorphism-bg) !important;
  border: 2px solid var(--secondary-color) !important;
  color: var(--text-secondary) !important;
}

.status-filter-btn.ultra-modern-btn:not(.active):hover {
  background: var(--card-bg) !important;
  border: 2px solid var(--primary-color) !important;
  color: var(--text-primary) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(67, 0, 255, 0.15) !important;
}

.bulk-btn.ultra-modern-btn {
  padding: 0.75rem 1.5rem !important;
  border-radius: var(--border-radius-medium) !important;
  font-weight: 600 !important;
  transition: var(--transition-smooth) !important;
  border: 2px solid transparent !important;
}

.ultra-modern-select,
.ultra-modern-input {
  background: var(--glassmorphism-bg) !important;
  border: 2px solid var(--tertiary-color) !important;
  color: var(--text-primary) !important;
  backdrop-filter: blur(10px) !important;
  transition: all 0.3s ease !important;
}

.ultra-modern-select:hover,
.ultra-modern-input:hover {
  border-color: var(--secondary-color) !important;
  box-shadow: 0 2px 8px rgba(0, 101, 248, 0.1) !important;
}

.ultra-modern-select:focus,
.ultra-modern-input:focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 3px rgba(67, 0, 255, 0.1), 0 4px 16px rgba(0, 101, 248, 0.2) !important;
  background: var(--card-bg) !important;
}

/* Bordures spécifiques pour les éléments de filtrage */
.property-select.ultra-modern-select {
  border: 2px solid #0065F8 !important;
  box-shadow: 0 2px 8px rgba(0, 101, 248, 0.15) !important;
}

.search-input.ultra-modern-input {
  border: 2px solid #00CAFF !important;
  box-shadow: 0 2px 8px rgba(0, 202, 255, 0.15) !important;
}

.sort-select.ultra-modern-select {
  border: 2px solid #4300FF !important;
  box-shadow: 0 2px 8px rgba(67, 0, 255, 0.15) !important;
}

/* Responsive */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-stats {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .filters-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .status-filters {
    width: 100%;
    justify-content: center;
  }
  
  .controls-row {
    flex-direction: column;
  }
  
  .search-container,
  .sort-container {
    width: 100%;
    max-width: none;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .bookings-management {
    padding: 1rem;
  }
  
  .page-header,
  .controls-section,
  .bookings-section {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .header-stats {
    flex-direction: column;
  }
  
  .stat-card {
    width: 100%;
  }
  
  .status-filters {
    flex-direction: column;
  }
  
  .table-container {
    font-size: 0.875rem;
  }
  
  .bookings-table th,
  .bookings-table td {
    padding: 0.75rem 0.5rem;
  }
  
  .client-info,
  .property-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
  
  .pagination-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

/* Styles spécifiques pour la modal de génération de factures */
.invoice-modal {
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
}

.invoice-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.invoice-summary {
  background: var(--glass-bg-light);
  border-radius: var(--border-radius-medium);
  padding: 2rem;
  border: 1px solid var(--glass-border);
}

.invoice-summary h4 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--electric-blue);
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--glass-bg-medium);
  border-radius: var(--border-radius-small);
  border: 1px solid var(--glass-border);
}

.summary-item.total {
  background: var(--primary-gradient);
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
  border: 2px solid var(--electric-blue);
  box-shadow: var(--shadow-neon-blue);
}

.summary-item .label {
  font-weight: 600;
  color: var(--text-secondary);
}

.summary-item.total .label {
  color: white;
}

.summary-item .value {
  font-weight: 600;
  color: var(--text-primary);
}

.summary-item.total .value {
  color: white;
}

.invoice-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.preview-btn {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
  border: 2px solid rgba(59, 130, 246, 0.3);
}

.preview-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.2);
  border-color: var(--electric-blue);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.generate-btn {
  background: var(--primary-gradient);
  color: white;
  border: 2px solid var(--electric-blue);
  box-shadow: var(--shadow-neon-blue);
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-cyber);
}

.secondary-btn {
  background: var(--glass-bg-medium);
  color: var(--text-secondary);
  border: 2px solid var(--glass-border);
}

.secondary-btn:hover {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
  border-color: var(--electric-blue);
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  font-size: 0.875rem;
  min-width: 180px;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.invoice-preview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--glass-border);
}

.preview-header h4 {
  color: var(--text-primary);
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.preview-container {
  background: white;
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--glass-border);
}

.pdf-preview {
  width: 100%;
  height: 600px;
  border: none;
  display: block;
}

.preview-actions {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid var(--glass-border);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  color: var(--laser-red);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--border-radius-medium);
  font-weight: 500;
}

.error-message svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
  flex-shrink: 0;
}

/* Responsive pour la modal de factures */
@media (max-width: 768px) {
  .invoice-modal {
    max-width: 95%;
    margin: 1rem;
  }
  
  .invoice-actions {
    flex-direction: column;
  }
  
  .btn {
    min-width: auto;
    width: 100%;
  }
  
  .preview-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .pdf-preview {
    height: 400px;
  }
  
  .summary-grid {
    gap: 0.75rem;
  }
  
  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
