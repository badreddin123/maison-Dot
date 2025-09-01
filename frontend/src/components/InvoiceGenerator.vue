<template>
  <div class="invoice-generator">
    <!-- Modal d'aperçu de la facture -->
    <div v-if="showPreview" class="invoice-modal-overlay" @click="closePreview">
      <div class="invoice-modal" @click.stop>
        <div class="invoice-modal-header">
          <h3>Aperçu de la facture</h3>
          <button @click="closePreview" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="invoice-modal-body">
          <div class="invoice-preview" ref="invoiceRef">
            <div class="invoice-content">
              <!-- En-tête de la facture -->
              <div class="invoice-header">
                <div class="company-info">
                  <div class="company-logo">
                    <div class="logo-cyber">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9,22 9,12 15,12 15,22"/>
                      </svg>
                    </div>
                    <h1>PropertyRental</h1>
                  </div>
                  <div class="company-details">
                    <p>123 Avenue des Propriétés</p>
                    <p>75001 Paris, France</p>
                    <p>Tel: +33 1 23 45 67 89</p>
                    <p>Email: contact@propertyrental.fr</p>
                    <p>SIRET: 123 456 789 00012</p>
                  </div>
                </div>
                
                <div class="invoice-meta">
                  <h2 class="invoice-title">FACTURE</h2>
                  <div class="invoice-number">N° {{ currentInvoice.invoice_number }}</div>
                  <div class="invoice-date">Date: {{ formatDate(currentInvoice.created_at) }}</div>
                  <div class="due-date">Échéance: {{ formatDate(currentInvoice.due_date) }}</div>
                </div>
              </div>

              <!-- Informations client -->
              <div class="billing-section">
                <div class="billing-info">
                  <h3>Facturé à:</h3>
                  <div class="client-details">
                    <p><strong>{{ booking.client?.name }}</strong></p>
                    <p>{{ booking.client?.email }}</p>
                    <p v-if="booking.client?.phone">{{ booking.client.phone }}</p>
                  </div>
                </div>
                
                <div class="property-info">
                  <h3>Propriété louée:</h3>
                  <div class="property-details">
                    <p><strong>{{ booking.property?.title }}</strong></p>
                    <p>{{ booking.property?.address }}</p>
                    <p>Type: {{ getPropertyTypeLabel(booking.property?.type || '') }}</p>
                  </div>
                </div>
              </div>

              <!-- Détails de la réservation -->
              <div class="booking-details">
                <h3>Détails de la réservation</h3>
                <div class="booking-info-grid">
                  <div class="info-item">
                    <span class="label">Période:</span>
                    <span class="value">Du {{ formatDate(booking.start_date) }} au {{ formatDate(booking.end_date) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Durée:</span>
                    <span class="value">{{ getDurationInNights(booking.start_date, booking.end_date) }} nuit(s)</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Nombre d'invités:</span>
                    <span class="value">{{ booking.guests }} personne(s)</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Statut:</span>
                    <span class="value status" :class="booking.status">{{ getStatusLabel(booking.status) }}</span>
                  </div>
                </div>
              </div>

              <!-- Tableau des articles -->
              <div class="invoice-items">
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Période</th>
                      <th>Quantité</th>
                      <th>Prix unitaire</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="main-item">
                      <td>
                        <div class="item-description">
                          <strong>Location {{ getPropertyTypeLabel(booking.property?.type || '').toLowerCase() }}</strong>
                          <div class="item-subtitle">{{ booking.property?.title }}</div>
                        </div>
                      </td>
                      <td>{{ formatDate(booking.start_date) }} - {{ formatDate(booking.end_date) }}</td>
                      <td>{{ getDurationInNights(booking.start_date, booking.end_date) }} nuit(s)</td>
                      <td>{{ formatCurrency(booking.property?.price_per_night || 0) }}</td>
                      <td>{{ formatCurrency(subtotal) }}</td>
                    </tr>
                    
                    <!-- Frais de service -->
                    <tr class="service-fee">
                      <td>
                        <div class="item-description">
                          <strong>Frais de service</strong>
                          <div class="item-subtitle">Commission plateforme (10%)</div>
                        </div>
                      </td>
                      <td>-</td>
                      <td>1</td>
                      <td>{{ formatCurrency(serviceFee) }}</td>
                      <td>{{ formatCurrency(serviceFee) }}</td>
                    </tr>
                    
                    <!-- Frais de nettoyage si applicable -->
                    <tr v-if="cleaningFee > 0" class="cleaning-fee">
                      <td>
                        <div class="item-description">
                          <strong>Frais de nettoyage</strong>
                          <div class="item-subtitle">Nettoyage professionnel</div>
                        </div>
                      </td>
                      <td>-</td>
                      <td>1</td>
                      <td>{{ formatCurrency(cleaningFee) }}</td>
                      <td>{{ formatCurrency(cleaningFee) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Totaux -->
              <div class="invoice-totals">
                <div class="totals-section">
                  <div class="total-line">
                    <span class="total-label">Sous-total:</span>
                    <span class="total-value">{{ formatCurrency(subtotal) }}</span>
                  </div>
                  <div class="total-line">
                    <span class="total-label">Frais de service:</span>
                    <span class="total-value">{{ formatCurrency(serviceFee) }}</span>
                  </div>
                  <div v-if="cleaningFee > 0" class="total-line">
                    <span class="total-label">Frais de nettoyage:</span>
                    <span class="total-value">{{ formatCurrency(cleaningFee) }}</span>
                  </div>
                  <div class="total-line tax-line">
                    <span class="total-label">TVA (20%):</span>
                    <span class="total-value">{{ formatCurrency(taxAmount) }}</span>
                  </div>
                  <div class="total-line final-total">
                    <span class="total-label">Total TTC:</span>
                    <span class="total-value">{{ formatCurrency(totalAmount) }}</span>
                  </div>
                </div>
              </div>

              <!-- Informations de paiement -->
              <div class="payment-info">
                <h3>Informations de paiement</h3>
                <div class="payment-details">
                  <div v-if="currentInvoice.status === 'paid'" class="payment-status paid">
                    <div class="status-icon">✓</div>
                    <div class="status-text">
                      <strong>Payé le {{ formatDate(currentInvoice.paid_at || '') }}</strong>
                      <p v-if="currentInvoice.payment_method">Méthode: {{ getPaymentMethodLabel(currentInvoice.payment_method) }}</p>
                      <p v-if="currentInvoice.payment_reference">Référence: {{ currentInvoice.payment_reference }}</p>
                    </div>
                  </div>
                  
                  <div v-else class="payment-status pending">
                    <div class="status-icon">⏳</div>
                    <div class="status-text">
                      <strong>En attente de paiement</strong>
                      <p>Échéance: {{ formatDate(currentInvoice.due_date) }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="payment-methods">
                  <h4>Modalités de paiement</h4>
                  <ul>
                    <li>Paiement par carte bancaire via notre plateforme sécurisée</li>
                    <li>Virement bancaire (IBAN disponible sur demande)</li>
                    <li>PayPal (frais supplémentaires applicables)</li>
                  </ul>
                </div>
              </div>

              <!-- Notes et conditions -->
              <div class="invoice-footer">
                <div class="notes-section">
                  <h4>Notes importantes:</h4>
                  <ul>
                    <li>Cette facture est générée automatiquement par notre système</li>
                    <li>En cas de questions, contactez notre service client</li>
                    <li>Annulation possible selon nos conditions générales</li>
                    <li v-if="booking.special_requests">Demandes spéciales: {{ booking.special_requests }}</li>
                  </ul>
                </div>
                
                <div class="legal-info">
                  <p><strong>Conditions légales:</strong></p>
                  <p>TVA applicable selon la réglementation française en vigueur.</p>
                  <p>Numéro de TVA intracommunautaire: FR12345678901</p>
                  <p>Société soumise aux conditions générales disponibles sur notre site web.</p>
                </div>
              </div>

              <!-- QR Code pour vérification -->
              <div class="verification-section">
                <div class="qr-code-placeholder">
                  <div class="qr-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                      <path d="M12 7h2v2h-2V7z"/>
                      <path d="M14 12h2v2h-2v-2z"/>
                      <path d="M12 14h2v2h-2v-2z"/>
                    </svg>
                  </div>
                  <p>Code de vérification</p>
                  <small>{{ currentInvoice.invoice_number }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="invoice-modal-footer">
          <button @click="downloadPDF" class="download-btn" :disabled="isGenerating">
            <svg v-if="!isGenerating" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            <div v-else class="spinner"></div>
            {{ isGenerating ? 'Génération...' : 'Télécharger PDF' }}
          </button>
          
          <button @click="downloadAdvancedPDF" class="download-btn advanced" :disabled="isGenerating">
            <svg v-if="!isGenerating" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <circle cx="12" cy="15" r="3"/>
              <path d="M12 12v3"/>
            </svg>
            <div v-else class="spinner"></div>
            {{ isGenerating ? 'Génération...' : 'PDF Professionnel' }}
          </button>
          
          <button @click="printInvoice" class="print-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="6,9 6,2 18,2 18,9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Imprimer
          </button>
          
          <button @click="closePreview" class="cancel-btn">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { InvoiceService } from '../utils/invoiceService'
import type { BookingData as IBookingData, InvoiceData as IInvoiceData } from '../utils/invoiceService'

// Types
interface BookingData {
  id: number
  start_date: string
  end_date: string
  guests: number
  status: string
  special_requests?: string
  property?: {
    title: string
    address: string
    type: string
    price_per_night: number
  }
  client?: {
    name: string
    email: string
    phone?: string
  }
}

interface InvoiceData {
  id: number
  invoice_number: string
  created_at: string
  due_date: string
  status: string
  paid_at?: string
  payment_method?: string
  payment_reference?: string
}

// Props
const props = defineProps<{
  booking: BookingData
  invoiceData?: InvoiceData
  show: boolean
}>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// État local
const showPreview = ref(false)
const isGenerating = ref(false)
const invoiceRef = ref<HTMLElement>()

// Computed
const subtotal = computed(() => {
  const nights = getDurationInNights(props.booking.start_date, props.booking.end_date)
  return (props.booking.property?.price_per_night || 0) * nights
})

const serviceFee = computed(() => {
  return Math.round(subtotal.value * 0.10) // 10% de frais de service
})

const cleaningFee = computed(() => {
  // Frais de nettoyage basés sur le type de propriété
  const fees: Record<string, number> = {
    'apartment': 50,
    'house': 80,
    'office': 30
  }
  const propertyType = props.booking.property?.type || 'apartment'
  return fees[propertyType] || 50
})

const baseAmount = computed(() => {
  return subtotal.value + serviceFee.value + cleaningFee.value
})

const taxAmount = computed(() => {
  return Math.round(baseAmount.value * 0.20) // TVA 20%
})

const totalAmount = computed(() => {
  return baseAmount.value + taxAmount.value
})

const currentInvoice = computed(() => {
  return props.invoiceData || {
    id: 1,
    invoice_number: `INV-${props.booking.id}-${new Date().getFullYear()}`,
    created_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  }
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

const getDurationInNights = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

const getPropertyTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'house': 'Maison',
    'apartment': 'Appartement',
    'office': 'Bureau'
  }
  return labels[type] || type
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

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    'card': 'Carte bancaire',
    'bank_transfer': 'Virement bancaire',
    'paypal': 'PayPal',
    'cash': 'Espèces'
  }
  return labels[method] || method
}

const generateInvoice = () => {
  showPreview.value = true
}

const closePreview = () => {
  showPreview.value = false
  emit('close')
}

const downloadPDF = async () => {
  if (!invoiceRef.value) return
  
  isGenerating.value = true
  
  try {
    // Configuration pour html2canvas
    const canvas = await html2canvas(invoiceRef.value, {
      scale: 2, // Haute qualité
      useCORS: true,
      backgroundColor: '#ffffff',
      width: invoiceRef.value.scrollWidth,
      height: invoiceRef.value.scrollHeight,
      scrollX: 0,
      scrollY: 0
    })
    
    // Créer le PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // Calculer les dimensions pour l'ajustement
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pdfWidth - 20 // Marges de 10mm de chaque côté
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Vérifier si l'image dépasse la hauteur de la page
    if (imgHeight > pdfHeight - 20) {
      // Si l'image est trop haute, on la divise en pages
      const pageHeight = pdfHeight - 20
      const totalPages = Math.ceil(imgHeight / pageHeight)
      
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage()
        
        const sourceY = i * (canvas.height / totalPages)
        const sourceHeight = Math.min(canvas.height / totalPages, canvas.height - sourceY)
        
        // Créer un canvas temporaire pour cette partie
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        if (tempCtx) {
          tempCanvas.width = canvas.width
          tempCanvas.height = sourceHeight
          tempCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight)
          
          const tempImgData = tempCanvas.toDataURL('image/png')
          pdf.addImage(tempImgData, 'PNG', 10, 10, imgWidth, (sourceHeight * imgWidth) / canvas.width)
        }
      }
    } else {
      // L'image tient sur une page
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
    }
    
    // Télécharger le PDF
    const fileName = `facture-${currentInvoice.value.invoice_number}-${props.booking.property?.title?.replace(/[^a-zA-Z0-9]/g, '-') || 'property'}.pdf`
    pdf.save(fileName)
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error)
    alert('Erreur lors de la génération du PDF. Veuillez réessayer.')
  } finally {
    isGenerating.value = false
  }
}

const downloadAdvancedPDF = async () => {
  if (!props.booking) return
  
  isGenerating.value = true
  
  try {
    await InvoiceService.generatePDF({
      booking: props.booking as IBookingData,
      invoiceData: props.invoiceData as IInvoiceData
    })
  } catch (error) {
    console.error('Erreur lors de la génération du PDF professionnel:', error)
    alert('Erreur lors de la génération du PDF. Veuillez réessayer.')
  } finally {
    isGenerating.value = false
  }
}

const printInvoice = () => {
  window.print()
}

// Exposer la méthode pour le composant parent
defineExpose({
  generateInvoice
})

// Watcher pour le prop show
import { watch } from 'vue'
watch(() => props.show, (newValue) => {
  if (newValue) {
    showPreview.value = true
  }
})
</script>

<style scoped>
@import url('../assets/cyber-theme.css');

.invoice-modal-overlay {
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

.invoice-modal {
  background: white;
  border-radius: var(--border-radius-large);
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-cyber);
}

.invoice-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.invoice-modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.close-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.close-btn svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: #6b7280;
}

.invoice-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.invoice-preview {
  background: white;
  min-height: 29.7cm; /* A4 height */
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.invoice-content {
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  color: #1f2937;
  line-height: 1.6;
}

/* En-tête de la facture */
.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 3px solid #3b82f6;
}

.company-info {
  flex: 1;
}

.company-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.logo-cyber {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-cyber svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: white;
  stroke-width: 2;
}

.company-logo h1 {
  font-size: 1.8rem;
  font-weight: 900;
  color: #1f2937;
  margin: 0;
}

.company-details p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.invoice-meta {
  text-align: right;
}

.invoice-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #3b82f6;
  margin: 0 0 1rem 0;
}

.invoice-number,
.invoice-date,
.due-date {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invoice-number {
  font-weight: 700;
  color: #1f2937;
}

/* Informations de facturation */
.billing-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.billing-info h3,
.property-info h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  border-bottom: 2px solid #3b82f6;
  padding-bottom: 0.5rem;
}

.client-details p,
.property-details p {
  margin: 0.5rem 0;
  color: #4b5563;
}

/* Détails de la réservation */
.booking-details {
  margin-bottom: 2rem;
}

.booking-details h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.booking-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.info-item .label {
  font-weight: 600;
  color: #6b7280;
}

.info-item .value {
  font-weight: 600;
  color: #1f2937;
}

.info-item .value.status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.value.status.confirmed {
  background: #d1fae5;
  color: #065f46;
}

.value.status.pending {
  background: #fef3c7;
  color: #92400e;
}

.value.status.completed {
  background: #dbeafe;
  color: #1e40af;
}

.value.status.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

/* Tableau des articles */
.invoice-items {
  margin-bottom: 2rem;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.items-table th {
  background: #f3f4f6;
  color: #374151;
  font-weight: 700;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #e5e7eb;
}

.items-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.items-table tr:last-child td {
  border-bottom: none;
}

.item-description strong {
  display: block;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.item-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.main-item {
  background: #fefefe;
}

.service-fee,
.cleaning-fee {
  background: #f9fafb;
}

/* Totaux */
.invoice-totals {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.totals-section {
  width: 300px;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.total-line:last-child {
  border-bottom: none;
}

.total-line.tax-line {
  color: #6b7280;
  font-size: 0.9rem;
}

.total-line.final-total {
  border-top: 2px solid #3b82f6;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 700;
  font-size: 1.125rem;
  color: #1f2937;
}

.total-label {
  color: #6b7280;
}

.total-value {
  font-weight: 600;
  color: #1f2937;
}

/* Informations de paiement */
.payment-info {
  margin-bottom: 2rem;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.payment-info h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.payment-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
}

.payment-status.paid {
  background: #d1fae5;
  border: 1px solid #a7f3d0;
}

.payment-status.pending {
  background: #fef3c7;
  border: 1px solid #fde68a;
}

.status-icon {
  font-size: 1.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.status-text strong {
  display: block;
  margin-bottom: 0.25rem;
}

.payment-methods h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.payment-methods ul {
  margin: 0;
  padding-left: 1.5rem;
}

.payment-methods li {
  margin: 0.25rem 0;
  color: #6b7280;
  font-size: 0.9rem;
}

/* Pied de page */
.invoice-footer {
  margin-bottom: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.notes-section,
.legal-info {
  margin-bottom: 1.5rem;
}

.notes-section h4,
.legal-info p:first-child {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #1f2937;
}

.notes-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.notes-section li,
.legal-info p {
  margin: 0.25rem 0;
  color: #6b7280;
  font-size: 0.9rem;
}

/* QR Code */
.verification-section {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  border-top: 1px solid #e5e7eb;
}

.qr-code-placeholder {
  text-align: center;
}

.qr-box {
  width: 4rem;
  height: 4rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  background: #f9fafb;
}

.qr-box svg {
  width: 2rem;
  height: 2rem;
  stroke: #6b7280;
}

.qr-code-placeholder p {
  margin: 0.5rem 0 0.25rem 0;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;
}

.qr-code-placeholder small {
  color: #6b7280;
  font-size: 0.8rem;
}

/* Footer du modal */
.invoice-modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.download-btn,
.print-btn,
.cancel-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.download-btn {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.download-btn:hover:not(:disabled) {
  background: #2563eb;
}

.download-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.download-btn.advanced {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #10b981;
}

.download-btn.advanced:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
}

.print-btn {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.print-btn:hover {
  background: #059669;
}

.cancel-btn {
  background: transparent;
  color: #6b7280;
  border-color: #d1d5db;
}

.cancel-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.download-btn svg,
.print-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
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
  .invoice-modal {
    margin: 1rem;
    max-width: none;
  }
  
  .billing-section,
  .booking-info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .invoice-header {
    flex-direction: column;
    gap: 2rem;
  }
  
  .invoice-meta {
    text-align: left;
  }
  
  .invoice-modal-footer {
    flex-direction: column;
  }
}

/* Styles d'impression */
@media print {
  .invoice-modal-overlay,
  .invoice-modal-header,
  .invoice-modal-footer {
    display: none !important;
  }
  
  .invoice-modal {
    width: 100% !important;
    max-width: none !important;
    max-height: none !important;
    margin: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  
  .invoice-modal-body {
    padding: 0 !important;
  }
  
  .invoice-content {
    padding: 1cm !important;
  }
}
</style>
