<template>
  <div class="bulk-invoice-export">
    <!-- Bouton d'ouverture du modal -->
    <button 
      @click="openModal"
      class="bulk-export-btn"
      :disabled="!hasSelectedBookings"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <path d="M16 13H8M16 17H8"/>
        <circle cx="18" cy="18" r="3"/>
        <path d="m19.5 21-1.5-1.5"/>
      </svg>
      Exporter les factures ({{ selectedBookings.length }})
    </button>

    <!-- Modal d'export -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Export des factures en lot</h3>
          <button @click="closeModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="export-summary">
            <h4>{{ selectedBookings.length }} réservation(s) sélectionnée(s)</h4>
            <div class="booking-list">
              <div 
                v-for="booking in selectedBookingsList" 
                :key="booking.id"
                class="booking-item"
              >
                <div class="booking-info">
                  <strong>{{ booking.property?.title }}</strong>
                  <span class="client-name">{{ booking.client?.name }}</span>
                  <span class="booking-dates">
                    {{ formatDate(booking.start_date) }} - {{ formatDate(booking.end_date) }}
                  </span>
                  <span class="booking-amount">{{ formatCurrency(booking.total_price) }}</span>
                </div>
                <div class="booking-status" :class="booking.status">
                  {{ getStatusLabel(booking.status) }}
                </div>
              </div>
            </div>
          </div>

          <div class="export-options">
            <h4>Options d'exportation</h4>
            
            <div class="option-group">
              <label class="option-label">
                <input 
                  type="radio" 
                  v-model="exportFormat" 
                  value="separate"
                  name="format"
                >
                <span class="checkmark"></span>
                <div class="option-content">
                  <strong>Fichiers séparés</strong>
                  <p>Une facture PDF par réservation (archive ZIP)</p>
                </div>
              </label>
              
              <label class="option-label">
                <input 
                  type="radio" 
                  v-model="exportFormat" 
                  value="combined"
                  name="format"
                >
                <span class="checkmark"></span>
                <div class="option-content">
                  <strong>Document unique</strong>
                  <p>Toutes les factures dans un seul PDF</p>
                </div>
              </label>
              
              <label class="option-label">
                <input 
                  type="radio" 
                  v-model="exportFormat" 
                  value="excel"
                  name="format"
                >
                <span class="checkmark"></span>
                <div class="option-content">
                  <strong>Tableau Excel</strong>
                  <p>Résumé des réservations au format Excel</p>
                </div>
              </label>
            </div>

            <div class="date-filter">
              <h5>Filtrage par période (optionnel)</h5>
              <div class="date-inputs">
                <div class="date-group">
                  <label>Date de début :</label>
                  <input 
                    type="date" 
                    v-model="dateFilter.start"
                    class="date-input"
                  >
                </div>
                <div class="date-group">
                  <label>Date de fin :</label>
                  <input 
                    type="date" 
                    v-model="dateFilter.end"
                    class="date-input"
                  >
                </div>
              </div>
            </div>

            <div class="company-info-section">
              <h5>Informations de l'entreprise</h5>
              <div class="company-fields">
                <div class="field-group">
                  <label>Nom de l'entreprise :</label>
                  <input 
                    type="text" 
                    v-model="companyInfo.name"
                    placeholder="PropertyRental"
                  >
                </div>
                <div class="field-group">
                  <label>Adresse :</label>
                  <textarea 
                    v-model="companyInfo.address"
                    rows="2"
                    placeholder="123 Avenue des Propriétés&#10;75001 Paris, France"
                  ></textarea>
                </div>
                <div class="field-row">
                  <div class="field-group">
                    <label>Téléphone :</label>
                    <input 
                      type="text" 
                      v-model="companyInfo.phone"
                      placeholder="+33 1 23 45 67 89"
                    >
                  </div>
                  <div class="field-group">
                    <label>Email :</label>
                    <input 
                      type="email" 
                      v-model="companyInfo.email"
                      placeholder="contact@propertyrental.fr"
                    >
                  </div>
                </div>
                <div class="field-row">
                  <div class="field-group">
                    <label>SIRET :</label>
                    <input 
                      type="text" 
                      v-model="companyInfo.siret"
                      placeholder="123 456 789 00012"
                    >
                  </div>
                  <div class="field-group">
                    <label>N° TVA :</label>
                    <input 
                      type="text" 
                      v-model="companyInfo.tva"
                      placeholder="FR12345678901"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeModal" class="btn secondary">
            Annuler
          </button>
          <button 
            @click="startExport" 
            class="btn primary"
            :disabled="isExporting || !exportFormat"
          >
            <div v-if="isExporting" class="btn-loading">
              <div class="spinner"></div>
              <span>{{ exportProgress }}%</span>
            </div>
            <span v-else>Exporter</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Progress Modal -->
    <div v-if="showProgressModal" class="modal-overlay">
      <div class="progress-modal">
        <div class="progress-content">
          <h3>Export en cours...</h3>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: exportProgress + '%' }"
            ></div>
          </div>
          <p>{{ currentExportStatus }}</p>
          <p class="progress-text">{{ exportProgress }}% terminé</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { BulkExportService } from '../utils/bulkExportService'
import type { ExportOptions, BookingExportData } from '../utils/bulkExportService'
import { useToast } from '../composables/useToast'

interface BookingDetails {
  id: number
  start_date: string
  end_date: string
  total_price: number
  status: string
  guests: number
  client?: {
    name: string
    email: string
  }
  property?: {
    title: string
    price_per_night: number
    type?: string
  }
}

// Props
const props = defineProps<{
  selectedBookings: number[]
  allBookings: BookingDetails[]
}>()

// Emits
const emit = defineEmits<{
  exportComplete: [success: boolean, message: string]
}>()

// Composables
const { exportSuccess, exportError } = useToast()

// État local
const showModal = ref(false)
const showProgressModal = ref(false)
const isExporting = ref(false)
const exportProgress = ref(0)
const currentExportStatus = ref('')
const exportFormat = ref('separate')

const dateFilter = ref({
  start: '',
  end: ''
})

const companyInfo = ref({
  name: 'PropertyRental',
  address: '123 Avenue des Propriétés\n75001 Paris, France',
  phone: '+33 1 23 45 67 89',
  email: 'contact@propertyrental.fr',
  siret: '123 456 789 00012',
  tva: 'FR12345678901'
})

// Computed
const hasSelectedBookings = computed(() => {
  return props.selectedBookings.length > 0
})

const selectedBookingsList = computed(() => {
  return props.allBookings.filter(booking => 
    props.selectedBookings.includes(booking.id)
  )
})

const filteredBookings = computed(() => {
  let bookings = selectedBookingsList.value

  if (dateFilter.value.start || dateFilter.value.end) {
    bookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.start_date)
      const startDate = dateFilter.value.start ? new Date(dateFilter.value.start) : null
      const endDate = dateFilter.value.end ? new Date(dateFilter.value.end) : null

      if (startDate && bookingDate < startDate) return false
      if (endDate && bookingDate > endDate) return false
      return true
    })
  }

  return bookings
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
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'En attente',
    'confirmed': 'Confirmée',
    'completed': 'Terminée',
    'cancelled': 'Annulée'
  }
  return labels[status] || status
}

const openModal = () => {
  if (!hasSelectedBookings.value) return
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  exportProgress.value = 0
  currentExportStatus.value = ''
}

const startExport = async () => {
  if (!exportFormat.value || filteredBookings.value.length === 0) return

  isExporting.value = true
  showProgressModal.value = true
  showModal.value = false
  exportProgress.value = 0

  try {
    const exportOptions: ExportOptions = {
      format: exportFormat.value as 'separate' | 'combined' | 'excel',
      dateFilter: {
        start: dateFilter.value.start || undefined,
        end: dateFilter.value.end || undefined
      },
      companyInfo: companyInfo.value
    }

    const bookingsToExport: BookingExportData[] = filteredBookings.value.map(booking => ({
      id: booking.id,
      start_date: booking.start_date,
      end_date: booking.end_date,
      total_price: booking.total_price,
      status: booking.status,
      guests: booking.guests,
      client: booking.client,
      property: booking.property ? {
        title: booking.property.title,
        price_per_night: booking.property.price_per_night,
        type: booking.property.type || 'apartment',
        address: undefined
      } : undefined
    }))

    await BulkExportService.exportBookings(
      bookingsToExport,
      exportOptions,
      (progress, status) => {
        exportProgress.value = progress
        currentExportStatus.value = status
      }
    )

    const formatLabel = exportFormat.value === 'excel' ? 'Excel' : 
                       exportFormat.value === 'combined' ? 'PDF combiné' : 'ZIP'
    
    exportSuccess(filteredBookings.value.length, formatLabel)
    emit('exportComplete', true, `Export terminé avec succès (${filteredBookings.value.length} factures)`)
  } catch (error) {
    console.error('Erreur lors de l\'export:', error)
    exportError('Une erreur est survenue lors de l\'export des factures')
    emit('exportComplete', false, 'Erreur lors de l\'export des factures')
  } finally {
    isExporting.value = false
    showProgressModal.value = false
    exportProgress.value = 0
    currentExportStatus.value = ''
  }
}

// Watchers
watch(() => props.selectedBookings, () => {
  if (props.selectedBookings.length === 0) {
    closeModal()
  }
})
</script>

<style scoped>
@import url('../assets/cyber-theme.css');

.bulk-export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.bulk-export-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.bulk-export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.bulk-export-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
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

.export-summary h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.booking-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  background: var(--glass-bg-light);
}

.booking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--glass-border);
}

.booking-item:last-child {
  border-bottom: none;
}

.booking-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.booking-info strong {
  color: var(--text-primary);
  font-size: 0.9rem;
}

.client-name,
.booking-dates,
.booking-amount {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.booking-status {
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.booking-status.confirmed {
  background: rgba(16, 185, 129, 0.1);
  color: var(--acid-green);
}

.booking-status.pending {
  background: rgba(245, 158, 11, 0.1);
  color: var(--solar-orange);
}

.booking-status.completed {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
}

.booking-status.cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: var(--laser-red);
}

.export-options {
  margin-top: 2rem;
}

.export-options h4,
.export-options h5 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.export-options h5 {
  font-size: 1rem;
  margin-top: 1.5rem;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.option-label:hover {
  background: var(--glass-bg-medium);
}

.option-label input[type="radio"] {
  display: none;
}

.checkmark {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--glass-border);
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}

.option-label input[type="radio"]:checked ~ .checkmark {
  border-color: var(--electric-blue);
  background: var(--electric-blue);
}

.option-label input[type="radio"]:checked ~ .checkmark::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  background: white;
  border-radius: 50%;
}

.option-content strong {
  display: block;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.option-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.date-filter,
.company-info-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--glass-bg-light);
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--glass-border);
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
  color: var(--text-secondary);
  font-weight: 600;
}

.date-input {
  padding: 0.75rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-small);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.date-input:focus {
  outline: none;
  border-color: var(--electric-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.company-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-group label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.field-group input,
.field-group textarea {
  padding: 0.75rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-small);
  color: var(--text-primary);
  font-size: 0.875rem;
  resize: vertical;
}

.field-group input:focus,
.field-group textarea:focus {
  outline: none;
  border-color: var(--electric-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  border-top: 1px solid var(--glass-border);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.btn.secondary {
  background: var(--glass-bg-medium);
  color: var(--text-secondary);
  border: 1px solid var(--glass-border);
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-modal {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 2rem;
  text-align: center;
  min-width: 400px;
}

.progress-content h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--glass-bg-strong);
  border-radius: var(--border-radius-small);
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: 600;
  color: var(--electric-blue);
  margin: 0.5rem 0;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-width: none;
  }
  
  .date-inputs,
  .field-row {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style>
